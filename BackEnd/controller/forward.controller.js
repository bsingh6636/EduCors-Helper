import axios from 'axios';
import ApiUsage from '../models/apiUsage.schema.js';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import moment from 'moment';
import User from '../models/user.model.js';
// https://educorssolver.host/api/user/getData
export const forwardUrl = asyncErrorHandler(async (req, res) => {
    const { Target } = req.body;
    console.log(Target)
    if (!Target || !Target.startsWith('http')) {
        return res.status(400).json({ success: false, message: 'Invalid target URL' });
    }

    try {
        // Forward the request to the target URL with necessary headers
        const response = await axios.get(Target, {
            responseType: 'stream', // Stream the response directly
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://www.swiggy.com/',
            },
        });

        // Stream the response back to the client
        response.data.pipe(res);
    } catch (error) {
        console.error('Error fetching the target URL:', error.message);
        return res.status(500).json({ success: false, message: 'Error fetching the target URL' });
    }
})

export const VerifyApiKey = asyncErrorHandler(async (req, res, next) => {
    const { ApiKey } = req.body;

    // Find user by ApiKey
    try {
        let user = await User.findOne({ ApiKey });
        //fix undefined handling
        if (!user) return res.status(404).json({ message: 'User not found' });
        //   console.log('user')

        // Get the endpoint that was accessed
        const endpoint = req.originalUrl;

        // Get the start of the current day for comparison (midnight of today)
        const todayStart = moment().startOf('day').toDate();

        // Find or create API usage record
        let apiUsage = await ApiUsage.findOne({ UserName: user._id });

        const currentTime = new Date(); // Current timestamp

        if (apiUsage) {
            // Check for existing record for today and the same endpoint
            const existingRecord = apiUsage.usageRecords.find(record => {
                return record.endpoint === endpoint && moment(record.timestamps[0]).isSame(todayStart, 'day');
            });

            if (existingRecord) {
                existingRecord.calls += 1; // Increment the call count
                existingRecord.timestamps.push(currentTime); // Add current timestamp
            } else {
                apiUsage.usageRecords.push({
                    endpoint,
                    calls: 1,
                    timestamps: [currentTime]
                });
            }

            try {
                await ApiUsage.findOneAndUpdate(
                    { _id: apiUsage._id }, // Filter by _id
                    { $set: { usageRecords: apiUsage.usageRecords } }, // Update the usage records
                    { new: true, useFindAndModify: false } // Ensure new document is returned
                );
            } catch (error) {
                console.log(error);
                return res.json(error);
            }
        }
    }catch (error) {
        console.log(error)
        return res.status(404).json({ message: 'error occured' });
    }
});
// Controller to get API usage statistics
export const getApiUsage = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req.params;

    try {
        const usage = await ApiUsage.aggregate([
            { $match: { UserName: mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$endpoint', totalCalls: { $sum: '$calls' }, dates: { $push: '$date' } } },
            { $sort: { '_id': 1 } }
        ]);
    } catch (error) {
        console.log('error', error)
    }

    return res.status(200).json(usage);
});

