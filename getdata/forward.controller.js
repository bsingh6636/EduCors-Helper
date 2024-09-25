import axios from 'axios';
import { asyncErrorHandler } from './utils/asyncErrorHandler.js';
import User from './models/user.model.js';
import mongoose from 'mongoose';
import ApiUsage from './models/apiUsage.schema.js'
import { timeGenerator } from './envHelper.js';
// https://educorssolver.host/api/user/getData
export const forwardUrl = asyncErrorHandler(async (req, res) => {
    const { Target } = req.body;
    console.log('target' ,Target)
    
    // Validate the Target URL
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

        // Set appropriate headers for the response (for example, assuming JSON is returned)
        res.setHeader('Content-Type', response.headers['content-type'] || 'application/json');

        // Stream the response from the target to the client
        response.data.pipe(res);

        // End the response when streaming is finished
        response.data.on('end', () => {
            res.end();
        });

    } catch (error) {
        console.error('Error fetching the target URL:', error.message);
        return res.status(500).json({ success: false, message: 'Error fetching the target URL' });
    }
});

export const getApiUsage = asyncErrorHandler(async (req, res, next) => {
    let { userId } = req.body;
    // const { ObjectId } = mongoose.Types; 
    if (!userId) return res.status(400).json({ sucess: false, message: 'userId not found' })

    try {
        const usage = await ApiUsage.findOne({ UserName: new mongoose.Types.ObjectId(userId) })

        return res.status(200).json(usage);
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ message: 'Error fetching usage statistics' });
    }
});


export const VerifyApiKey = asyncErrorHandler(async (req, res, next) => {
    const { ApiKey, Target } = req.body;
    if (!ApiKey || !Target) return res.status(400).json({ success: false, message: 'ApiKey and Target are required' });
    const time = timeGenerator();
    const { formattedDate, year, month, day } = time;

    try {
        let user = await User.findOne({ ApiKey });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const endpoint = Target;

        // Find or create API usage record for the user
        let apiUsage = await ApiUsage.findOne({ UserName: user._id });

        if (!apiUsage) {
            apiUsage = new ApiUsage({
                UserName: user._id,
                totalApiCalls: 0,
                usageRecords: []
            });
        }

        // Increment total API calls
        apiUsage.totalApiCalls += 1;
        const monthKey = `${year}-${month}`;
        let monthlyRecord = apiUsage.usageRecords.find(record => record.month === monthKey);

        if (!monthlyRecord) {
            monthlyRecord = {
                month: monthKey,
                totalEndpointCalls: 0,
                dailyRecord: []
            };
            apiUsage.usageRecords.push(monthlyRecord);
        }

        const dayKey = `${year}-${month}-${day}`;
        let dailyRecord = monthlyRecord.dailyRecord.find(record => record.date === dayKey);

        if (!dailyRecord) {
            dailyRecord = {
                date: dayKey,
                calls: 0,
                endpointRecord: []
            };
            monthlyRecord.dailyRecord.push(dailyRecord);
        }

        // Increment daily call count
        dailyRecord.calls += 1;

        // Find or create endpoint record
        let endpointRecord = dailyRecord.endpointRecord.find(record => record.endpoint === endpoint);

        if (!endpointRecord) {
            endpointRecord = {
                endpoint,
                calls: 0
            };
            dailyRecord.endpointRecord.push(endpointRecord);
        }

        // Increment total endpoint calls
        endpointRecord.calls += 1;
        monthlyRecord.totalEndpointCalls += 1; // Update monthly total

        await apiUsage.save();

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error occurred' });
    }
});

