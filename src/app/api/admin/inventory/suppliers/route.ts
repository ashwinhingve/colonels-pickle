import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Supplier from '@/models/Supplier';
import { supplierSchema } from '@/lib/validations/supplier';
import AdminActivity from '@/models/AdminActivity';

/**
 * GET /api/admin/inventory/suppliers
 * List suppliers with pagination and search
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
    const status = searchParams.get('status'); // 'active', 'inactive', 'all'

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    await connectDB();

    // Build query
    const query: any = {};

    // Status filter
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Search filter (name, contactPerson, email, phone)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Execute query
    const [items, total] = await Promise.all([
      Supplier.find(query)
        .select('-__v')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Supplier.countDocuments(query),
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
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch suppliers',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inventory/suppliers
 * Create a new supplier
 * Admin only
 */
export async function POST(req: NextRequest) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;
  const session = adminCheck.session;

  try {
    const body = await req.json();

    // Validate with Zod
    const validated = supplierSchema.parse(body);

    await connectDB();

    // Create supplier
    const supplier = await Supplier.create(validated);

    // Log admin activity
    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown Admin',
        adminEmail: session.user.email,
        action: 'supplier_created',
        entityType: 'supplier',
        entityId: supplier._id,
        details: { name: supplier.name, contactPerson: supplier.contactPerson },
      });
    } catch (logError) {
      console.error('Error logging admin activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json(
      {
        success: true,
        supplier,
        message: 'Supplier created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating supplier:', error);

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
        error: 'Failed to create supplier',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
