import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    UserName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    totalApiCalls: { type: Number, default: 0 },
    dailyCounts: { type: Map, of: Number, default: {} },
    // Retained so existing accounts can still read their historical activity.
    usageRecords: { type: Array, default: [] },
    recentLogs: [
      {
        endpoint: String,
        method: String,
        statusCode: Number,
        latencyMs: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);
export default mongoose.models.ApiUsage || mongoose.model('ApiUsage', schema);
