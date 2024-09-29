import nodeMailer from 'nodemailer'
require('dotenv').config()

export const transporter  = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    }
}
)

async function sendOtpToMail(email:string,tokenOTP:string):Promise<boolean> {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "รหัสยืนยัน Email ✔",
            text: `รหัสยืนยัน Email`,
            html: `<!DOCTYPE html>
                    <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>RMTS</title>
                        <style>
                            .Header{
                            width:100%;
                            padding-top:15px;
                            padding-bottom:15px;
                            background-color:#fca903;
                            color:#FFF;
                            font-size:30px;
                            text-align: center;
                            }
                            .Contents{
                            width:100%;
                            padding-top:40px;
                            padding-bottom:40px;
                            background-color:#FFF;
                            color:#000;
                            font-size:20px;
                            text-align: center;
                            }
                            .Footer{
                            width:100%;
                            padding-top:10px;
                            padding-bottom:10px;
                            background-color:#bd8109;
                            color:#000;
                            font-size:20;
                            text-align: center;
                            }
                        </style>
                        </head>
                        <body>
                            <div class="Header"> รหัสยืนยัน </div>
                                <div class="Contents">
                                    รหัส ${tokenOTP} <br>
                                    <span style="font-size:16px;">
                                    (รหัสยืนยันจะหมดอายุใน 5 นาที)
                                    </span>
                                </div>
                            <div class="Footer">ระบบติดตามความก้าวหน้างานวิจัย</div>
                        </body>
                    </html>`,
        })
        return true
    }catch {
        return false
    }
}

export default sendOtpToMail
