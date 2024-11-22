import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import User from '@/models/user.model'; // User model
import QRCode from '@/models/qrcode.model'; // QRCode model

export async function GET(request: NextRequest) {
  try {
    // Extract the JWT token from the request headers
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    // console.log("token", token)

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the userId from the token
    const { id: userId } = token;

    // Fetch the user's information from the User model
    const user = await User.findById(userId).select('name email avatar isVerified createdAt');
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

     // Fetch the user's QR codes from the QRCode model
     const qrCodes = await QRCode.find({ user: userId });

     // Map through each QR code to format the response
     const qrCodeDetails = qrCodes.map((qrCode) => ({
       _id: qrCode._id,
       title: qrCode.title,
       showTitle: qrCode.showTitle,
       targetUrl: qrCode.targetUrl,
       scanCount: qrCode.scanCount,
       qrOptions: qrCode.qrOptions,
       shortId: qrCode.shortId,
       createdAt: qrCode.createdAt,
       updatedAt: qrCode.updatedAt,
       qrImageUrl: qrCode.qrOptions?.data || `${process.env.DOMAIN}/api/v1/qr?shortId=${qrCode.shortId}&targetUrl=${qrCode?.targetUrl}`,
     }));
 
     // Combine the user info and QR code data
     const dashboardData = {
       user: {
         name: user.name,
         email: user.email,
         avatar: user.avatar,
         isVerified: user.isVerified,
         createdAt: user.createdAt,
       },
       qrCodes: qrCodeDetails, // Return the QR code array directly
     };
 
     return NextResponse.json({ message: "Dashboard data fetched successfully", dashboardData }, { status: 200 });
   } catch (error) {
     console.error("Error:", error);
     return NextResponse.json({ message: "Error processing request" }, { status: 500 });
   }
 }