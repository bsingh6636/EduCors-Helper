import mongoose from 'mongoose';

const endpointRecordSchema = new mongoose.Schema({
    endpoint: { type: String, required: true },
    calls: { type: Number, default: 1 },
});

const dailyRecordSchema = new mongoose.Schema({
    date: { type: String, required: true },
    calls: { type: Number, default: 1 },
    endpointRecord: [endpointRecordSchema], // Corrected schema reference
});

const apiUsageSchema = new mongoose.Schema({
    UserName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    totalApiCalls: { type: Number, default: 1 },
    usageRecords: [
        {
            month: { type: String, required: true },
            totalEndpointCalls: { type: Number, default: 1 },
            dailyRecord: [dailyRecordSchema], // Corrected schema reference
        }
    ],
});

const ApiUsage = mongoose.model('ApiUsage', apiUsageSchema);
export default ApiUsage;

