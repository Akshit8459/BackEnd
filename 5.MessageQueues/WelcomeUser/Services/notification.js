const {Queue, Worker} = require('bullmq');
const redis=require('ioredis');

const redisClient = new redis({
    host: 'localhost',
    port: 6379
}, {
    maxRetriesPerRequest: null
});

// Queue for sending notifications

const notificationQueue = new Queue('notificationQueue', {
    connection: redisClient
});
const notificationErrors = new Queue('notificationErrors', {
    connection: redisClient
});

//function to add a job to the queue
const addJob=async (data) => {
    try {
        await notificationQueue.add('sendNotification', data);
        console.log('Job added to the queue:', data);
    } catch (error) {
        console.error('Error adding job to the queue:', error);
        await notificationErrors.add('errorNotification', {
            error: error.message,
            data: data
        });
        console.error('Error added to notificationErrors queue:', {
            error: error.message,
            data: data
        });
    }
};

// Worker to process the jobs in the queue
const nodemailer=require('nodemailer');
const transporter=nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL_USER, // your email user
        pass: process.env.EMAIL_PASS // your email password
    }
});
const worker = new Worker('notificationQueue', async job => {
    try {
        const {name, email, age, phone} = job.data;
        console.log(`Sending notification to ${name} (${email})...`);
        let info=await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: 'Welcome to Our Service', // Subject line
            text: `Hello ${name},\n\nThank you for subscribing to our service! We are excited to have you on board.\n\nBest regards,\nYour Service Team`, // plain text body
            html: `<p>Hello <strong>${name}</strong>,</p><p>Thank you for subscribing to our service! We are excited to have you on board.</p><p>Best regards,<br>Your Service Team</p>` // html body
        });
        console.log('Message sent:', info);
        console.log(`Notification sent to ${name} : (${email}) successfully.`);
    } catch (error) {
        console.error('Error sending notification:', error);
        await notificationErrors.add('errorNotification', {
            error: error.message,
            data: job.data
        });
        console.error('Error added to notificationErrors queue:', {
            error: error.message,
            data: job.data
        });
    }
}, {
    connection: redisClient,
});


module.exports = {
    addJob,
    notificationQueue,
    notificationErrors
};