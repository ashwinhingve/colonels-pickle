import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    // Connect to database
    await connectDB();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';

    // Build query
    const query: any = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by role
    if (role && ['client', 'admin'].includes(role)) {
      query.role = role;
    }

    // Build sort
    const sort: any = {};
    if (sortBy === 'orders') {
      sort.orderCount = -1;
    } else if (sortBy === 'spent') {
      sort.totalSpent = -1;
    } else {
      sort[sortBy] = -1;
    }

    // Fetch users with pagination
    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean() as any,
      User.countDocuments(query),
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(totalUsers / limit);

    // Fetch order statistics for each user
    const usersWithStats = await Promise.all(
      (users as any[]).map(async (user: any) => {
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

        return {
          id: user._id.toString(),
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
      })
    );

    return Response.json({
      users: usersWithStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
      },
    });
  } catch (error) {
    console.error('GET /api/admin/users error:', error);
    return Response.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
