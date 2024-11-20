import QRCode from 'qrcode';

interface QRCodeOptions {
  color: string;  // Single color for both dark and light parts of the QR code
  errorCorrectionLevel: string;
  gradientStart?: string;  // Optional start color for gradient
  gradientEnd?: string;    // Optional end color for gradient
}

async function generateStylizedQRCode(data: any, options: any, qrText: string = 'Scan Me!') {
  console.log("data : ", data);
  console.log("options : ", options);
  console.log("title : ", qrText);

  const canvas = document.createElement('canvas');
  const ctx: any = canvas.getContext('2d');

  // Generate QR code onto a canvas element
  const qrCanvas = document.createElement('canvas'); // QR canvas
  await QRCode.toCanvas(qrCanvas, data, options);

  // Get the color from options (applies to both foreground and background)
  const qrColor = options.color;

  // Set the canvas size based on QR code size
  canvas.width = qrCanvas.width + 80;  // Add padding and border space
  canvas.height = qrCanvas.height + 120;  // Add space for title text and padding

  // If a gradient is provided, create it
  if (options.gradientStart && options.gradientEnd) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, options.gradientStart);
    gradient.addColorStop(1, options.gradientEnd);
    ctx.fillStyle = gradient;
  } else {
    // Default background color (use the same single color for background)
    ctx.fillStyle = qrColor;
  }

  // Fill the canvas with the background or gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add a border around the QR code
  const padding = 20;
  const borderWidth = 10;

  ctx.fillStyle = qrColor;
  ctx.fillRect(
    (canvas.width - qrCanvas.width - 2 * padding) / 2 - borderWidth,
    (canvas.height - qrCanvas.height - 2 * padding - 50) / 2 - borderWidth,
    qrCanvas.width + 2 * padding + 2 * borderWidth,
    qrCanvas.height + 2 * padding + 2 * borderWidth
  );

  // Add QR code to canvas inside the border
  ctx.drawImage(
    qrCanvas,
    (canvas.width - qrCanvas.width) / 2,
    (canvas.height - qrCanvas.height - 50) / 2
  );

  // Add dynamic title text below the QR code
  ctx.font = '20px Arial';
  ctx.fillStyle = qrColor; // Use the same color for the text
  ctx.textAlign = 'center';
  ctx.fillText(qrText, canvas.width / 2, canvas.height - 20);

  // Return the Data URL directly from canvas
  return canvas.toDataURL(); // Return the image URL for use in the browser
}

export default generateStylizedQRCode;
