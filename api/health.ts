export default function handler(req, res) {
    res.status(200).json({
        message: 'Data Vise API is working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        status: 'healthy'
    });
}
