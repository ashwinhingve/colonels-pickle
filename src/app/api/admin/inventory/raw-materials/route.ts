import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import RawMaterial from '@/models/RawMaterial';
import { rawMaterialSchema } from '@/lib/validations/raw-material';
import AdminActivity from '@/models/AdminActivity';

/**
 * GET /api/admin/inventory/raw-materials
 * List raw materials with pagination, search, and filters
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
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status'); // 'active', 'inactive', 'all'
    const stockLevel = searchParams.get('stockLevel'); // 'low', 'out', 'available'

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    await connectDB();

    // Build query
    const query: any = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Search filter (name or itemCode)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { itemCode: { $regex: search, $options: 'i' } },
      ];
    }

    // Stock level filter - compare against each item's own lowStockThreshold
    if (stockLevel) {
      // For stock level filtering, we need to fetch all items first to check their thresholds
      // Or use aggregation. For simplicity with MongoDB, we'll use basic filters:
      // out = currentStock 0
      // low = 0 < currentStock <= lowStockThreshold
      // available = currentStock > lowStockThreshold
      if (stockLevel === 'out') {
        query.currentStock = 0;
      } else if (stockLevel === 'low') {
        query.$expr = {
          $and: [{ $gt: ['$currentStock', 0] }, { $lte: ['$currentStock', '$lowStockThreshold'] }],
        };
      } else if (stockLevel === 'available') {
        query.$expr = {
          $gt: ['$currentStock', '$lowStockThreshold'],
        };
      }
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Execute query
    const [items, total] = await Promise.all([
      RawMaterial.find(query)
        .select('-__v')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('supplierId', 'name')
        .lean(),
      RawMaterial.countDocuments(query),
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
    console.error('Error fetching raw materials:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch raw materials',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inventory/raw-materials
 * Create a new raw material
 * Admin only
 */
export async function POST(req: NextRequest) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;
  const session = adminCheck.session;

  try {
    const body = await req.json();

    // Validate with Zod
    const validated = rawMaterialSchema.parse(body);

    await connectDB();

    // Create raw material
    const rawMaterial = await RawMaterial.create(validated);

    // Log admin activity
    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown Admin',
        adminEmail: session.user.email,
        action: 'raw_material_created',
        entityType: 'raw_material',
        entityId: rawMaterial._id,
        details: { itemCode: rawMaterial.itemCode, name: rawMaterial.name },
      });
    } catch (logError) {
      console.error('Error logging admin activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json(
      {
        success: true,
        rawMaterial,
        message: 'Raw material created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating raw material:', error);

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

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          error: `${field} already exists`,
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create raw material',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
