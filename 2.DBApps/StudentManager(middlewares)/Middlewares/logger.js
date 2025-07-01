const fs=require('fs');
const path = require('path');

module.exports= async (req,res,next)=>{
    try{
        const start=Date.now();
        res.on('finish',()=>{
            const duration=Date.now()-start;
            const logPath = path.join(__dirname, '../Logs/logfile.txt');
            const logLine = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - IP: ${req.ip}\n`;
            fs.appendFileSync(logPath,logLine);
        });
        next();
    }
    catch(err){
        console.error('Logging Middleware Error:', err.message);
        res.status(500).json({ message: "Error occurred while creating logs", error: err });
    }
}