import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import User from '@/models/user.model'; // User model
import QRCode from '@/models/qrcode.model'; // QRCode model
import dbConnect from '@/dbConfig/dbConfig';
import ScanLog from '@/models/qrscanlog.model';
import UserHistory from '@/models/userhistory.model';

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

    await dbConnect();
    // Fetch the user's information from the User model
    const user = await User.findById(userId).select('name email avatar isVerified createdAt');
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

     // Fetch the user's QR codes from the QRCode model
     const qrCodes = await QRCode.find({ user: userId });

     // Map through each QR code to format the response
     const qrCodeDetails = await Promise.all(
      qrCodes.map(async (qrCode) => {
        // Fetch the scanner details from the ScanLog model
        const scanLogs = await ScanLog .find({ qrCode: qrCode._id }).select('ip userAgent referer timestamp');
        

        let qrOptions = qrCode.qrOptions;
        if (qrOptions?.data?.includes('shortId=find')) {
          qrOptions.data = qrOptions.data.replace('shortId=find', `shortId=${qrCode.shortId}`);
        }


        if (qrOptions?.data) {
          const domain = process.env.DOMAIN!.replace(/\/$/, ""); // Remove trailing slash if any
          qrOptions.data = qrOptions.data.replace(new RegExp(`^(${domain})?`), domain);
        }
    
    
        // Determine the QR image URL
        const qrImageUrl =
          qrOptions?.data ||
          `${process.env.DOMAIN}/api/v1/qr?shortId=${qrCode.shortId}&targetUrl=${qrCode.targetUrl}`;

          
        // Return QR code details along with the scanner data
        return {
          _id: qrCode._id,
          title: qrCode.title,
          showTitle: qrCode.showTitle,
          targetUrl: qrCode.targetUrl,
          scanCount: qrCode.scanCount,
          qrOptions: qrOptions,
          shortId: qrCode.shortId,
          createdAt: qrCode.createdAt,
          updatedAt: qrCode.updatedAt,
          qrImageUrl,
          scans: scanLogs, // Add the scanner data here
        };
      })
    );
 

     // Fetch the user's history from the UserHistory model
     const userHistory = await UserHistory.find({ user: userId })
     .sort({ createdAt: -1 }) // Sort by most recent actions
     .select('actionType targetModel targetId changes description createdAt'); // Select relevant fields

   // Format the user history data
   const historyDetails = userHistory.map((history) => ({
     id: history._id,
     actionType: history.actionType,
     targetModel: history.targetModel,
     targetId: history.targetId,
     changes: history.changes,
     description: history.description,
     createdAt: history.createdAt,
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
       qrCodes: qrCodeDetails, 
       history: historyDetails,
     };
 
     return NextResponse.json({ message: "Dashboard data fetched successfully", dashboardData }, { status: 200 });
   } catch (error) {
     console.error("Error:", error);
     return NextResponse.json({ message: "Error processing request" }, { status: 500 });
   }
 }