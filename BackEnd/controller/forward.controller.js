import axios from 'axios';

export const forwardUrl = async (req, res) => {
    const { target } = req.body;

    // Validate the target URL
    if (!target || !target.startsWith('http')) {
        return res.status(400).json({ success: false, message: 'Invalid target URL' });
    }

    try {
        // Forward the request to the target URL
        const response = await axios.get(target, {
            responseType: 'stream', // Stream the response directly
        });

        // Stream the response back to the client
        response.data.pipe(res);
    } catch (error) {
        console.error('Error fetching the target URL:', error.message);
        return res.status(500).json({ success: false, message: 'Error fetching the target URL' });
    }
};

