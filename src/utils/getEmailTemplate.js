
export const getEmailTemplate = (body) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            width: 100px;
            height: 100px;
        }
        .content {
            text-align: center;
        }
        .content h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .content p {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff !important;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
           ▶️
        </div>
        <div class="content">
            <h1>Verify Your Email</h1>
            <p>Thank you for registering with us. Please click the button below to verify your email address.</p>
            <a href="${body.link}" class="btn">Verify Email</a>
        </div>
        <div class="footer">
            <p>If you did not create an account, no further action is required.</p>
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
};

/* 
export const sendEmail = asyncHandler(async (req, res) => {
    const { to, subject = "Verify you email - MhFLicks", body } = req.body;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_APP_PASS,
        },
    });
    const mailInfo = {
        from: `"Mh Flicks ▶️ " <${process.env.GMAIL}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: getEmailTemplate(body), // html body
    }
    // send mail with defined transport object
    const info = await transporter.sendMail(mailInfo);
    if (!info) {
        throw new ApiError(500, "email not sent")
    }
    console.log(info.messageId)
    res
        .status(200)
        .json(
            new ApiResponse(200, info.messageId, "Email sent successfully")
        )
})

*/