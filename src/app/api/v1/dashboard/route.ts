import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import User from '@/models/user.model';
import QRCode from '@/models/qrcode.model';
import dbConnect from '@/dbConfig/dbConfig';
import ScanLog from '@/models/qrscanlog.model';
import UserHistory from '@/models/userhistory.model';
import { startOfDay, subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = token;

    await dbConnect();
    const user = await User.findById(userId).select('name email avatar isVerified createdAt');
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get all QR codes for the user
    const qrCodes = await QRCode.find({ user: userId });
    const qrCodeIds = qrCodes.map(qr => qr._id);

    // Get analytics data for the last 7 days
    const today = startOfDay(new Date());
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, i);
      return {
        date,
        formattedDate: format(date, 'MMM dd'),
        timestamp: date.getTime(),
      };
    }).reverse();

    // Fetch scan logs for the last 7 days
    const scanLogs = await ScanLog.find({
      qrCode: { $in: qrCodeIds },
      timestamp: {
        $gte: last7Days[0].date,
        $lte: new Date()
      }
    });

    // Calculate daily scan counts
    const dailyScans = last7Days.map(day => {
      const scansOnDay = scanLogs.filter(log => 
        startOfDay(new Date(log.timestamp)).getTime() === day.date.getTime()
      );
      return scansOnDay.length;
    });

    // Calculate total scans and active QR codes
    const totalScans = scanLogs.length;
    const activeQrCodes = qrCodes.filter(qr => qr.isActive).length;

    // Format graph data
    const graphData = {
      labels: last7Days.map(day => day.formattedDate),
      scans: dailyScans,
    };

    // Combine all dashboard data
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      stats: {
        totalQrCodes: qrCodes.length,
        totalScans,
        recentScans: dailyScans[dailyScans.length - 1], // Today's scans
        activeQrCodes,
      },
      graphData,
    };

    return NextResponse.json({ 
      success: true,
      message: "Dashboard data fetched successfully", 
      data: dashboardData 
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}