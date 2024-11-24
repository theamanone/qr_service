import mongoose, { Schema, Document } from "mongoose";

export interface IScanLog extends Document {
  qrCode: mongoose.Types.ObjectId;
  ip: string;
  userAgent: string;
  referer: string;
  timestamp: Date;
}

const ScanLogSchema = new Schema<IScanLog>({
  qrCode: { type: Schema.Types.ObjectId, ref: "QRCode", required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  referer: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
});

const ScanLog = mongoose.models.ScanLog || mongoose.model<IScanLog>("ScanLog", ScanLogSchema);

export default ScanLog;
