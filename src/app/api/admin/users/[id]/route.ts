import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import AdminActivity from '@/models/AdminActivity';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Verify admin access
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;
    const session = adminCheck.session;

    // Connect to database
    await connectDB();

    // Await params
    const { id } = await params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return Response.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await User.findById(id).select('-password').lean() as any;

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch order statistics
    const [orderCount, orderStats] = await Promise.all([
      Order.countDocuments({ userId: user._id }),
      Order.aggregate([
        {
          $match: {
            userId: user._id,
            paymentStatus: 'paid',
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: '$totalAmount' },
          },
        },
      ]),
    ]);

    const userData = {
      id: (user._id as any).toString(),
      name: user.name || 'N/A',
      email: user.email,
      phoneNumber: user.phoneNumber || null,
      role: user.role || 'client',
      image: user.image || null,
      orderCount,
      totalSpent: orderStats[0]?.totalSpent || 0,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      lastLogin: user.lastLogin?.toISOString() || null,
    };

    return Response.json(userData);
  } catch (error) {
    console.error(`GET /api/admin/users/[id] error:`, error);
    return Response.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // Verify admin access
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;
    const session = adminCheck.session;

    // Connect to database
    await connectDB();

    // Await params
    const { id } = await params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return Response.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, phoneNumber, role } = body;

    // Validate input
    const updates: any = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return Response.json(
          { error: 'Invalid name' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (phoneNumber !== undefined) {
      if (phoneNumber !== null && (typeof phoneNumber !== 'string' || phoneNumber.trim().length === 0)) {
        return Response.json(
          { error: 'Invalid phone number' },
          { status: 400 }
        );
      }
      updates.phoneNumber = phoneNumber ? phoneNumber.trim() : null;
    }

    if (role !== undefined) {
      if (!['client', 'admin'].includes(role)) {
        return Response.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }

      // Prevent self-role-change (admin cannot demote themselves)
      if (id === session.user.id && role !== 'admin') {
        return Response.json(
          { error: 'You cannot change your own role.' },
          { status: 400 }
        );
      }

      updates.role = role;
    }

    // No updates provided
    if (Object.keys(updates).length === 0) {
      return Response.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    // Fetch user before update
    const userBefore = await User.findById(id).lean() as any;

    if (!userBefore) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Determine action and audit
    let action = 'user_updated';
    if (updates.role && updates.role !== userBefore.role) {
      action = 'user_role_changed';
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).select('-password').lean() as any;

    if (!updatedUser) {
      return Response.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Log admin activity
    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown',
        adminEmail: session.user.email,
        action,
        entityType: 'user',
        entityId: (userBefore._id as any),
        entityIdentifier: userBefore.email,
        details: {
          changes: updates,
          previousRole: userBefore.role,
        },
      });
    } catch (auditError) {
      console.error('Failed to log admin activity:', auditError);
      // Don't fail the request if audit logging fails
    }

    // Fetch updated order statistics
    const [orderCount, orderStats] = await Promise.all([
      Order.countDocuments({ userId: updatedUser._id }),
      Order.aggregate([
        {
          $match: {
            userId: updatedUser._id,
            paymentStatus: 'paid',
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: '$totalAmount' },
          },
        },
      ]),
    ]);

    const responseData = {
      id: (updatedUser._id as any).toString(),
      name: updatedUser.name || 'N/A',
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber || null,
      role: updatedUser.role || 'client',
      image: updatedUser.image || null,
      orderCount,
      totalSpent: orderStats[0]?.totalSpent || 0,
      createdAt: updatedUser.createdAt?.toISOString() || new Date().toISOString(),
      lastLogin: updatedUser.lastLogin?.toISOString() || null,
    };

    return Response.json(responseData);
  } catch (error) {
    console.error(`PATCH /api/admin/users/[id] error:`, error);
    return Response.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
