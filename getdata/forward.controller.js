import axios from 'axios';
import { asyncErrorHandler } from './utils/asyncErrorHandler.js';
import moment from 'moment';
import User from './models/user.model.js';
import mongoose from 'mongoose';
import ApiUsage from './models/apiUsage.schema.js'
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

    try {
        let user = await User.findOne({ ApiKey });

        // Handle undefined user
        if (!user) return res.status(404).json({ message: 'User not found' });

        const endpoint = req.originalUrl;
        const todayStart = moment().startOf('day').toDate();
        const currentTime = new Date();
        
        // Find or create API usage record
        let apiUsage = await ApiUsage.findOne({ UserName: user._id });

        if (!apiUsage) {
            apiUsage = new ApiUsage({
                UserName: user._id,
                totalApiCalls: 0,  // Initialize total calls
                usageRecords: []
            });
        }

        // Increment total API calls
        apiUsage.totalApiCalls += 1;

        // Check for existing record for today and the same endpoint
        const existingRecord = apiUsage.usageRecords.find(record => {
            return record.endpoint === endpoint && moment(record.timestamps[0]).isSame(todayStart, 'day');
        });

        if (existingRecord) {
            // Increment daily calls for the same endpoint
            existingRecord.calls += 1;
            existingRecord.timestamps.push(currentTime);
        } else {
            // Create a new record for the new endpoint or new day
            apiUsage.usageRecords.push({
                endpoint,
                calls: 1,
                timestamps: [currentTime]
            });
        }

        // Save or update the usage records
        await apiUsage.save();

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error occurred' });
    }
});

// Controller to get API usage statistics
export const getApiUsage = asyncErrorHandler(async (req, res, next) => {
    let { userId } = req.body;
    console.log('userId', userId)
    // const { ObjectId } = mongoose.Types; 
    if (!userId) return res.status(400).json({ sucess: false, message: 'userId not found' })

    try {
        const usage = await ApiUsage.findOne({ UserName: new mongoose.Types.ObjectId(userId) })
        console.log(userId)
        console.log(usage)

        return res.status(200).json(usage);
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ message: 'Error fetching usage statistics' });
    }
});


