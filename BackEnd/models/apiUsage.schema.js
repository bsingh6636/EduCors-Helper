// models/ApiUsage.js
import mongoose from 'mongoose';

const usageRecordSchema = new mongoose.Schema({
    endpoint: { type: String, required: true },
    calls: { type: Number, default: 1 },
    timestamps: [{ type: Date }] // Array to store the date and time of each call
});

const apiUsageSchema = new mongoose.Schema({
    UserName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    totalApiCalls: { type: Number, default: 0 },
    usageRecords: [usageRecordSchema], // Array to store usage records
});

const ApiUsage = mongoose.model('ApiUsage', apiUsageSchema);
export default ApiUsage;
