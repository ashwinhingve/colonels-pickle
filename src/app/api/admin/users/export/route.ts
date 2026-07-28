import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';

/**
 * Escape a value for CSV format
 * - If value contains comma, quote, or newline, wrap in quotes
 * - Double any internal quotes
 */
function escapeCSV(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  const strValue = String(value);

  // Check if escaping is needed
  if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
    // Double any internal quotes and wrap in quotes
    return `"${strValue.replace(/"/g, '""')}"`;
  }

  return strValue;
}

export async function GET(request: Request) {
  try {
    // Verify admin access
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    // Connect to database
    await connectDB();

    // Fetch all users
    const users = await User.find({})
      .select('-password')
      .lean() as any[];

    // Fetch order statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user: any) => {
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
          name: user.name || 'N/A',
          email: user.email || '',
          role: user.role || 'client',
          phone: user.phoneNumber || '',
          orderCount,
          totalSpent: orderStats[0]?.totalSpent || 0,
          joinedDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
        };
      })
    );

    // Build CSV
    const headers = ['Name', 'Email', 'Role', 'Phone', 'Orders', 'Total Spent', 'Joined'];
    const csvRows = [
      headers.map(h => escapeCSV(h)).join(','),
      ...usersWithStats.map(user =>
        [
          escapeCSV(user.name),
          escapeCSV(user.email),
          escapeCSV(user.role),
          escapeCSV(user.phone),
          escapeCSV(user.orderCount),
          escapeCSV(user.totalSpent),
          escapeCSV(user.joinedDate),
        ].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');

    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `users-${dateStr}.csv`;

    // Return CSV response
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('GET /api/admin/users/export error:', error);
    return Response.json(
      { error: 'Failed to export users' },
      { status: 500 }
    );
  }
}
