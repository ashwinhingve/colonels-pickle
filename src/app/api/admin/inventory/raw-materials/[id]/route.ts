import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import RawMaterial from '@/models/RawMaterial';
import { rawMaterialUpdateSchema } from '@/lib/validations/raw-material';
import AdminActivity from '@/models/AdminActivity';

/**
 * GET /api/admin/inventory/raw-materials/[id]
 * Fetch a single raw material by ID
 * Admin only
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    const { id } = await params;

    await connectDB();

    const rawMaterial = await RawMaterial.findById(id).populate('supplierId').lean();

    if (!rawMaterial) {
      return NextResponse.json({ error: 'Raw material not found' }, { status: 404 });
    }

    return NextResponse.json(rawMaterial);
  } catch (error: any) {
    console.error('Error fetching raw material:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch raw material',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/inventory/raw-materials/[id]
 * Update a raw material (partial update)
 * Admin only
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;
  const session = adminCheck.session;

  try {
    const { id } = await params;
    const body = await req.json();

    // Validate with Zod (partial schema)
    const validated = rawMaterialUpdateSchema.parse(body);

    await connectDB();

    // Check if raw material exists
    const existing = await RawMaterial.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Raw material not found' }, { status: 404 });
    }

    // Update raw material
    const rawMaterial = await RawMaterial.findByIdAndUpdate(id, validated, {
      new: true,
      runValidators: true,
    }).populate('supplierId');

    // Log admin activity
    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown Admin',
        adminEmail: session.user.email,
        action: 'raw_material_updated',
        entityType: 'raw_material',
        entityId: rawMaterial._id,
        details: { itemCode: rawMaterial.itemCode, name: rawMaterial.name },
      });
    } catch (logError) {
      console.error('Error logging admin activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      rawMaterial,
      message: 'Raw material updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating raw material:', error);

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
        error: 'Failed to update raw material',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/inventory/raw-materials/[id]
 * Soft delete a raw material (set isActive to false)
 * Admin only
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;
  const session = adminCheck.session;

  try {
    const { id } = await params;

    await connectDB();

    // Check if raw material exists
    const existing = await RawMaterial.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Raw material not found' }, { status: 404 });
    }

    // Soft delete (set isActive to false)
    const rawMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    // Log admin activity
    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown Admin',
        adminEmail: session.user.email,
        action: 'raw_material_deleted',
        entityType: 'raw_material',
        entityId: rawMaterial._id,
        details: { itemCode: rawMaterial.itemCode, name: rawMaterial.name },
      });
    } catch (logError) {
      console.error('Error logging admin activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Raw material deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting raw material:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete raw material',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
