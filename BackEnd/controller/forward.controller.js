import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

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