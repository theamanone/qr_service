import dbConnect from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import QRCode from '@/models/qrcode.model';
import ScanLog from '@/models/qrscanlog.model';

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'Unknown IP';
  return ip.includes('::ffff:') ? ip.split('::ffff:')[1] : ip; // Strips "::ffff:"
}

// API to handle redirection and save scan data in the background
export async function GET(request: NextRequest) {
  await dbConnect(); // Ensure the database connection is established

  try {
    const searchParams = request.nextUrl.searchParams;
    const shortId = searchParams.get('shortId');
    const targetUrl = searchParams.get('targetUrl');

    // Extract client information
    const clientInfo = {
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent') || 'Unknown User-Agent',
      referer: request.headers.get('referer') || 'No Referrer',
    };

    // console.log('Client Info:', clientInfo);

    if (!shortId || !targetUrl) {
      return NextResponse.json(
        { error: 'Short ID or target URL missing' },
        { status: 400 }
      );
    }

    // Perform the redirect to the target URL
    const redirectResponse = NextResponse.redirect(targetUrl, 302);

    // Track the scan asynchronously
    setTimeout(async () => {
      try {
        // Find the QR Code by shortId
        const qrCode = await QRCode.findOneAndUpdate(
          { shortId },
          { $inc: { scanCount: 1 } }, // Increment scan count
          { new: true }
        );
        // console.log('Found QR Code:', qrCode);

        if (qrCode) {
          // Save the scan data in ScanLog
          await ScanLog.create({
            qrCode: qrCode._id,
            ip: clientInfo.ip,
            userAgent: clientInfo.userAgent,
            referer: clientInfo.referer,
            timestamp: new Date(),
          });

          // console.log('Scan data logged successfully');
        } else {
          console.error(`QR Code with shortId ${shortId} not found`);
        }
      } catch (err) {
        console.error('Error saving scan data:', err);
      }
    }, 0);

    // Always return a response
    return redirectResponse;
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Error processing the request' },
      { status: 500 }
    );
  }
}
