import dbConnect from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import QRCode from '@/models/qrcode.model';


function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'Unknown IP';
  //The ::ffff: prefix is a way to embed IPv4 addresses into IPv6 systems.
  // return forwarded ? forwarded.split(',')[0] : 'Unknown IP'; // with ::ffff
  return ip.includes('::ffff:') ? ip.split('::ffff:')[1] : ip; // without ::ffff
}
// API to handle redirection and save scan data in the background
export async function GET(request: NextRequest) {
  await dbConnect(); // Connect to the database

  try {
    const searchParams = request.nextUrl.searchParams;
    const shortId = searchParams.get("shortId");
    const targetUrl = searchParams.get("targetUrl");
    

    // Extract client information
    const clientInfo = {
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent') || 'Unknown User-Agent',
      referer: request.headers.get('referer') || 'No Referrer',
    };

    // console.log("shortId:", shortId);
    // console.log("targetUrl:", targetUrl);
    console.log("clientInfo:", clientInfo);

    if (!shortId || !targetUrl) {
      return NextResponse.json({ error: "Short ID or target URL missing" }, { status: 400 });
    }

    // Track the scan in the background without blocking the redirect
    setTimeout(async () => {
      try {
        // Increment scan count for the shortId
        await QRCode.findOneAndUpdate(
          { shortId }, // Match the shortId
          { $inc: { scanCount: 1 } }, // Increment the scanCount
          { new: true }
        );
      } catch (err) {
        console.error("Error saving scan data:", err);
      }
    }, 0); // Run asynchronously

    // Perform the redirect to the original URL
    return NextResponse.redirect(targetUrl, 302);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Error retrieving data' }, { status: 500 });
  }
}
