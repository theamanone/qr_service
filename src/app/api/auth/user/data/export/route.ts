import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/dbConfig/dbConfig'
import QRCode from '@/models/qrcode.model'
import ScanLog from '@/models/qrscanlog.model'
import User from '@/models/user.model'
import { getToken } from 'next-auth/jwt'
import * as XLSX from 'xlsx' // For Excel export
import { PDFDocument, StandardFonts } from 'pdf-lib'

export async function GET (request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    // User validation
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Connect to the database
    await connectDB()

    // Get the user ID
    const userId = token.sub

    // Fetch user details
    const user = await User.findById(userId).select('name email createdAt')
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Fetch QR codes and their scan logs
    const qrCodes = await QRCode.find({ user: userId })
    const data = await Promise.all(
      qrCodes.map(async qrCode => {
        const scans = await ScanLog.find({ qrCode: qrCode._id }).select(
          'ip userAgent timestamp'
        )
        return {
          qrId: qrCode._id,
          title: qrCode.title,
          targetUrl: qrCode.targetUrl,
          createdAt: qrCode.createdAt,
          updatedAt: qrCode.updatedAt,
          scanCount: qrCode.scanCount,
          scans: scans.map(scan => ({
            ip: scan.ip,
            userAgent: scan.userAgent,
            timestamp: scan.timestamp
          })),
          qrOptions: qrCode.qrOptions // Include qrOptions for JSON
        }
      })
    )

    // Format data for export
    const formattedData = {
      userDetails: {
        name: user.name,
        email: user.email,
        registeredOn: user.createdAt
      },
      qrCodes: data
    }

    // Determine export format (default to Excel)
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'excel'
    console.log('format', format)

    if (format === 'excel') {
      // Excel file generation (improved format)
      const workbook = XLSX.utils.book_new()

      // Add User Details sheet
      const userDetailsSheet = XLSX.utils.json_to_sheet([
        {
          Name: formattedData.userDetails.name,
          Email: formattedData.userDetails.email,
          'Registered On': formattedData.userDetails.registeredOn
        }
      ])

      // Set column widths for User Details sheet
      userDetailsSheet['!cols'] = [
        { wpx: 200 }, // Name column
        { wpx: 300 }, // Email column
        { wpx: 150 } // Registered On column
      ]

      XLSX.utils.book_append_sheet(workbook, userDetailsSheet, 'User Details')

      // Add QR Codes sheet
      const qrCodesData = formattedData.qrCodes.map(qr => ({
        'QR ID': qr.qrId,
        Title: qr.title,
        'Target URL': qr.targetUrl,
        'Created At': qr.createdAt,
        'Updated At': qr.updatedAt,
        'Scan Count': qr.scanCount
      }))
      const qrCodesSheet = XLSX.utils.json_to_sheet(qrCodesData)

      // Set column widths for QR Codes sheet
      qrCodesSheet['!cols'] = [
        { wpx: 120 }, // QR ID column
        { wpx: 250 }, // Title column
        { wpx: 300 }, // Target URL column
        { wpx: 150 }, // Created At column
        { wpx: 150 }, // Updated At column
        { wpx: 100 } // Scan Count column
      ]

      XLSX.utils.book_append_sheet(workbook, qrCodesSheet, 'QR Codes')

      // Add Scans sheet
      const scansData = formattedData.qrCodes.flatMap(qr =>
        qr.scans.map(scan => ({
          'QR ID': qr.qrId,
          IP: scan.ip,
          'User Agent': scan.userAgent,
          Timestamp: scan.timestamp
        }))
      )
      const scansSheet = XLSX.utils.json_to_sheet(scansData)

      // Set column widths for Scans sheet
      scansSheet['!cols'] = [
        { wpx: 120 }, // QR ID column
        { wpx: 150 }, // IP column
        { wpx: 200 }, // User Agent column
        { wpx: 180 } // Timestamp column
      ]

      XLSX.utils.book_append_sheet(workbook, scansSheet, 'Scans')

      // Write the workbook to a buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

      // Return the Excel file
      return new Response(buffer, {
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="UserData_${user.name}.xlsx"`
        }
      })
    } else if (format === 'json') {
      // Return JSON data
      //   return NextResponse.json(formattedData, { status: 200 });
      return NextResponse.json(
        {
          message: 'you dont have access to download in this format ! ',
          formattedData
        },
        { status: 200 }
      )
    } else if (format === 'pdf') {
      // PDF file generation
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([595, 842]) // A4 size in points
      const { width, height } = page.getSize()

      // Embed the Helvetica font
      const font = pdfDoc.embedStandardFont(StandardFonts.Helvetica)

      // Draw User Details
      page.drawText(`User Details:`, { x: 50, y: height - 100, font, size: 18 })
      page.drawText(`Name: ${formattedData.userDetails.name}`, {
        x: 50,
        y: height - 140,
        font,
        size: 12
      })
      page.drawText(`Email: ${formattedData.userDetails.email}`, {
        x: 50,
        y: height - 160,
        font,
        size: 12
      })
      page.drawText(
        `Registered On: ${formattedData.userDetails.registeredOn}`,
        { x: 50, y: height - 180, font, size: 12 }
      )

      let yPosition = height - 220
      page.drawText('QR Codes:', { x: 50, y: yPosition, font, size: 14 })
      yPosition -= 20

      // Draw QR Codes and their details
      formattedData.qrCodes.forEach(qr => {
        page.drawText(`QR ID: ${qr.qrId}`, {
          x: 50,
          y: yPosition,
          font,
          size: 12
        })
        yPosition -= 20
        page.drawText(`Title: ${qr.title}`, {
          x: 50,
          y: yPosition,
          font,
          size: 12
        })
        yPosition -= 20
        page.drawText(`Target URL: ${qr.targetUrl}`, {
          x: 50,
          y: yPosition,
          font,
          size: 12
        })
        yPosition -= 40 // Adding space before the next QR code
      })

      // Add footer with copyright information
      const footerText = `© ${new Date().getFullYear()} ${
        process.env.DOMAIN || 'YourDomain.com'
      } - All rights reserved`
      const footerYPosition = 40 // Position the footer text near the bottom of the page

      page.drawText(footerText, { x: 50, y: footerYPosition, font, size: 10 })

      // Save the PDF and return as a response
      const pdfBytes = await pdfDoc.save()
      return new Response(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="UserData_${user.name}.pdf"`
        }
      })
    } else {
      // Invalid format
      return NextResponse.json(
        { message: 'Invalid format specified' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error exporting user data:', error)
    return NextResponse.json(
      { message: 'Error processing export request' },
      { status: 500 }
    )
  }
}
