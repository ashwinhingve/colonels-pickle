import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import StockMovement from '@/models/StockMovement';
import RawMaterial from '@/models/RawMaterial';
import Product from '@/models/Product';
import AdminActivity from '@/models/AdminActivity';
import { stockMovementSchema } from '@/lib/validations/stock-movement';
import { Types } from 'mongoose';

/**
 * GET /api/admin/inventory/movements
 * List stock movements with pagination and filters
 * Admin only
 */
export async function GET(req: NextRequest) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    // Filters
    const itemType = searchParams.get('itemType'); // 'raw_material' | 'product'
    const itemId = searchParams.get('itemId'); // specific item id
    const movementType = searchParams.get('movementType'); // 'in' | 'out' | 'adjustment'
    const reason = searchParams.get('reason'); // 'purchase' | 'sale' | 'production' | 'manual_adjustment' | 'return'
    const dateFrom = searchParams.get('dateFrom'); // ISO date string
    const dateTo = searchParams.get('dateTo'); // ISO date string

    await connectDB();

    // Build query
    const query: any = {};

    if (itemType) {
      query.itemType = itemType;
    }

    if (itemId) {
      query.itemId = new Types.ObjectId(itemId);
    }

    if (movementType) {
      query.movementType = movementType;
    }

    if (reason) {
      query.reason = reason;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Set to end of day
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Execute query
    const [items, total] = await Promise.all([
      StockMovement.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('itemId', 'name itemCode currentStock stock')
        .populate('performedBy', 'name email')
        .lean(),
      StockMovement.countDocuments(query),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error('Error fetching stock movements:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stock movements',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inventory/movements
 * Create a manual stock movement (append-only ledger entry)
 * Admin only
 */
export async function POST(req: NextRequest) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;
  const session = adminCheck.session;

  try {
    const body = await req.json();

    // Validate with Zod
    const validated = stockMovementSchema.parse(body);

    await connectDB();

    // Look up the referenced item (RawMaterial or Product based on itemType)
    let item: any;
    const itemIdObj = new Types.ObjectId(validated.itemId);

    if (validated.itemType === 'raw_material') {
      item = await RawMaterial.findById(itemIdObj);
      if (!item) {
        return NextResponse.json(
          { error: 'Raw material not found' },
          { status: 404 }
        );
      }
    } else if (validated.itemType === 'product') {
      item = await Product.findById(itemIdObj);
      if (!item) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    // Determine current stock field name based on item type
    const stockFieldName =
      validated.itemType === 'raw_material' ? 'currentStock' : 'stock';
    const currentStock = item[stockFieldName];

    // Compute new stock based on movementType
    let newStock: number;

    if (validated.movementType === 'in') {
      // 'in' movement adds quantity to current stock
      newStock = currentStock + validated.quantity;
    } else if (validated.movementType === 'out') {
      // 'out' movement subtracts quantity from current stock
      newStock = currentStock - validated.quantity;
      // Reject if it would go negative
      if (newStock < 0) {
        return NextResponse.json(
          {
            error: 'Insufficient stock',
            details: `Cannot remove ${validated.quantity} units. Current stock is ${currentStock}.`,
          },
          { status: 400 }
        );
      }
    } else if (validated.movementType === 'adjustment') {
      // 'adjustment' sets the stock to the exact quantity value (absolute, not delta)
      newStock = validated.quantity;
    } else {
      return NextResponse.json(
        { error: 'Invalid movement type' },
        { status: 400 }
      );
    }

    // Update the item's stock field
    item[stockFieldName] = newStock;
    await item.save();

    // Create the StockMovement ledger row (append-only)
    const movement = await StockMovement.create({
      itemType: validated.itemType,
      itemId: itemIdObj,
      movementType: validated.movementType,
      quantity: validated.quantity,
      unitCost: validated.unitCost,
      reason: validated.reason,
      batchNumber: validated.batchNumber,
      notes: validated.notes,
      balanceAfter: newStock,
      performedBy: new Types.ObjectId(session.user.id),
    });

    // Log admin activity
    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown Admin',
        adminEmail: session.user.email,
        action: 'stock_movement_created',
        entityType: validated.itemType,
        entityId: itemIdObj,
        details: {
          movementType: validated.movementType,
          quantity: validated.quantity,
          reason: validated.reason,
          newStock,
        },
      });
    } catch (logError) {
      console.error('Error logging admin activity:', logError);
      // Don't fail the request if logging fails
    }

    // Return the created movement with populated fields
    const populatedMovement = await StockMovement.findById(movement._id)
      .populate('itemId', 'name itemCode currentStock stock')
      .populate('performedBy', 'name email')
      .lean();

    return NextResponse.json(
      {
        success: true,
        movement: populatedMovement,
        message: 'Stock movement recorded successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating stock movement:', error);

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create stock movement',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
