import { PrismaClient } from "@prisma/client";
import { Request , Response } from "express";
import { faker, MusicModule } from '@faker-js/faker'
import bcrypt from "bcrypt";
import { sign, SignOptions } from 'jsonwebtoken';
import * as speakeasy from 'speakeasy';
import sendOtpToMail from './../services/email';

require('dotenv').config()

const prisma = new PrismaClient()

function createToken(data:any,rememberMe?:boolean){
    return new Promise((resolve,reject)=>{

        let signInOption:SignOptions = {
            algorithm:'HS256',
            expiresIn:'8h'
        }

        if(rememberMe){
            signInOption.expiresIn = '1d'
        }

        resolve(sign(data,String(process.env.JWT_PRIVATE_KEY),signInOption))
    })
}

// login
module.exports.login = async (req:Request , res:Response) =>{
    const username:string = req.body.username
    const password:string = req.body.password
    const rememberMe:boolean = req.body.rememberMe

    //เช็คก่อนว่ามี user นี้ไหม

    const checkUsername = await prisma.users.count({
        where: {
            OR:[
                {User_Email : username},
                {User_Usernname: username,}
            ],
        }
    })
    // user is valide
    if(checkUsername >= 1){
        // get hash password from db
        const hashPassword:any = await prisma.users.findFirst({
            select: {
                User_password: true
            },
            where: {
                OR:[
                    {User_Email : username},
                    {User_Usernname:username}
                ],
            }
        })


        // check hash password
        const isPasswordValid:boolean = bcrypt.compareSync(password,String(hashPassword.User_password))

        // if password is valid and if admin login dont check password ??
        if(isPasswordValid || ((username === 'admin@gmail.com' || username ==='admin')&& password === 'admin')){

            // get user data
            let userData:any = await prisma.users.findMany({
                where: {
                    OR:[
                        {User_Email:username},
                        {User_Rmuti_Id:username},
                        {User_Usernname:username}
                    ]
                },
                include:{
                    USER_ROLES:{
                        include:{
                            ROLE_ID:true
                        }
                    },
                }
            })

            //จัดข้อมูล Role name ใหม่
            userData[0] = await userData.map((data:any)=>{
                const length = userData[0].USER_ROLES.length
                for(let i=0 ; i < length ; i++){
                    userData[0].USER_ROLES[i] = (userData[0].USER_ROLES[i].ROLE_ID.Role_Name)
                }
                return data
            })

            try{
                await createToken({username,hashPassword},rememberMe).then((tokenRespons)=>{
                    userData[0][0].User_Token = tokenRespons
                })

                // is first time to login ?
                if(userData[0][0].User_Email_Confirm === false){
                    res.send({
                        status: true,
                        isFirstTime: true,
                        msg: 'เข้าสู่ระบบครั้งแรก',
                        credentialData: userData[0][0]
                    })
                }else{
                    res.send({
                        status: true,
                        isFirstTime: false,
                        msg: 'เข้าสู่ระบบสำเร็จ',
                        credentialData: userData[0][0]
                    })
                }
            }catch(err){
                res.send({
                    status: false,
                    msg: 'มีบางอย่างผิดพลาดขณะสร้าง Token',
                    credentialData: userData[0][0]
                })
            }
            // create token

        // if password is invalid
        }else{
            res.send({
                status: false ,
                isFirstTime: false ,
                msg: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง'
            })
        }

    // no username and password in db or is not match
    }else{
        console.log('case 2');

        res.send({
            status: false ,
            isFirstTime: false ,
            msg: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง'
        })
    }

}

// register
module.exports.register = async (req:Request, res:Response) => {

    const id:number = req.body.OldAccount_Id
    const rmutiId:string = req.body.OldAccount_Rmuti_Id
    const username:string = req.body.OldAccount_UserName
    const fname:string = req.body.OldAccount_Fname
    const lname:string = req.body.OldAccount_Lname
    const password:string = req.body.OldAccount_Password
    const avatar:string = faker.image.cats()
    const email:string = req.body.OldAccount_UserName
    const joinedDate:Date = new Date()

    // hash password
    const hashPassword:string = bcrypt.hashSync(password, 10)


    // เพิ่ม new user
    await prisma.users.create({
        data: {
            User_Rmuti_Id: rmutiId,
            User_Usernname: username,
            User_password: hashPassword,
            User_Fname: fname,
            User_Lname: lname,
            User_Avatar: avatar,
            User_AboutMe: '',
            User_Phone: '',
            User_Email: email,
            User_Joined_Date: joinedDate,
            User_Banned:false,
            User_Deleted:false,
            User_Email_Confirm:false
        },
    })

    const newUserId:any = await prisma.users.findFirst({
        select: {
            User_Id: true
        },
        where: {
            User_Email: email,
        }
    })

    await prisma.user_Roles.create({
        data: {
            User_Roles_User_Id:Number(newUserId.User_Id),
            User_Roles_Role_id:1
        }
    })

    res.send({
        status:true,
        msg:'ลงทะเบียนสำเร็จแล้ว'
    })
}

// user register student / teacher
module.exports.userRegister = async (req:Request,res:Response) =>{
    const rmutiId:string = req.body.rmutiId
    const username:string = req.body.username
    const firstName:string = req.body.firstName
    const lastName:string = req.body.lastName
    const password:string = bcrypt.hashSync(rmutiId,10)
    const role:number = req.body.role

    // add student
    if(role === 1){
        // เช็คว่ามี นศษ คนนี้หรือยัง
        const checkRmutiId = await prisma.users.count({
            where:{
                User_Rmuti_Id: rmutiId
            }
        })
        if(checkRmutiId === 1){
            res.send({
                status:false ,
                msg:'นักศึกษาคนนี้มีรายชื่ออยู่แล้ว'
            })
        }else if(checkRmutiId < 1){
            try{
                // add student
                await prisma.users.create({
                    data:{
                        User_Rmuti_Id: rmutiId,
                        User_Fname: firstName,
                        User_Lname: lastName,
                        User_password: password,
                        User_Joined_Date: new Date(),
                        User_Email: `${rmutiId}@rmuti.ac.th`,
                        User_AboutMe: '',
                        User_Phone: '',
                        User_Banned: false,
                        User_Deleted: false,
                        User_Usernname: rmutiId,
                        User_Avatar: faker.image.food(),
                        User_Email_Confirm: false
                    }
                })

                // หา user id ล่าสุดที่พึ่ง add
                const userId = await prisma.users.findUnique({
                    select: {
                        User_Id: true
                    },
                    where: {
                        User_Rmuti_Id: rmutiId
                    }
                })

                // add role
                await prisma.user_Roles.create({
                    data: {
                        User_Roles_Role_id: role,
                        User_Roles_User_Id: userId!.User_Id
                    }
                })

                res.send({
                    status:true ,
                    msg:'เพิ่มนักศึกษาสำเร็จ'
                })
            }catch{
                res.send({
                    status:false ,
                    msg:'มีบางอย่างผิดพลาดขณะเพิ่มชื่อนักศึกษา'
                })
            }
        }else {
            res.send({
                status:false ,
                msg:'มีบางอย่างผิดพลาด'
            })
        }
    }else if(role ===2){
        // add teacher
        // เช็คว่ามี teacher คนนี้หรือยัง
        const checkRmutiId = await prisma.users.count({
            where:{
                User_Rmuti_Id: rmutiId
            }
        })
        if(checkRmutiId === 1){
            res.send({
                status:false ,
                msg:'มีรายชื่อนี้อยู่แล้ว'
            })
        }else if(checkRmutiId < 1){
            try{
                // add teacher
                await prisma.users.create({
                    data:{
                        User_Rmuti_Id: rmutiId,
                        User_Usernname: username,
                        User_Fname: firstName,
                        User_Lname: lastName,
                        User_password: password,
                        User_Joined_Date: new Date(),
                        User_Email: `${rmutiId}@rmuti.ac.th`,
                        User_AboutMe: '',
                        User_Phone: '',
                        User_Banned: false,
                        User_Deleted: false,
                        User_Avatar: faker.image.food(),
                        User_Email_Confirm: false
                    }
                })

                // หา user id ล่าสุดที่พึ่ง add
                const userId = await prisma.users.findUnique({
                    select: {
                        User_Id: true
                    },
                    where: {
                        User_Rmuti_Id: rmutiId
                    }
                })

                // add role
                await prisma.user_Roles.create({
                    data: {
                        User_Roles_Role_id: role,
                        User_Roles_User_Id: userId!.User_Id
                    }
                })

                res.send({
                    status:true ,
                    msg:'เพิ่มอาจารย์เรียบร้อย'
                })
            }catch(err){
                res.send({
                    status:false ,
                    msg:'มีบางอย่างผิดพลาดขณะเพิ่มชื่ออาจารย์'
                })
            }
        }else {
            res.send({
                status:false ,
                msg:'มีบางอย่างผิดพลาด'
            })
        }
    }
}

// register first time studebt / teacher
module.exports.registerFirstTime = async (req:Request, res:Response) => {
    const rmuti:string = req.body.rmutiId
    const username:string = req.body.username
    const fName:string = req.body.fName
    const lName:string = req.body.lName
    const email:string = req.body.email

    const emailCheck = await prisma.users.count({
        where:{
            User_Email:email
        }
    })
    if(emailCheck >= 1){
        res.send({
            status:false,
            msg:'อีเมลนี้ถูกลงทะเบียนแล้ว'
        })
    }else{
        try{
            await prisma.users.update({
                data:{
                    User_Usernname:username,
                    User_Fname:fName,
                    User_Lname:lName,
                    User_Email:email,
                    User_Email_Confirm:true
                },
                where:{
                    User_Rmuti_Id:rmuti
                }
            })

            res.send({
                status:true,
                msg:'ลงทะเบียนเสร็จเรียบร้อย'
            })
        }catch(err){
            res.send({
                status:true,
                msg:'มีบางอย่างผิดพลาด ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่ภายหลังหรือติดต่อผู้ดูแลระบบ'
            })
        }
    }
}

// send otp
module.exports.OtpSend = async (req:Request, res:Response) => {

    const purpose:string = req.body.purpose
    const email:string = req.body.email
    const rmutiId:string = req.body.rmutiId

    let count
    if(purpose === 'ForgotPassword'){
        count = await prisma.users.count({
            where: {
                User_Email : email
            }
        })
    }else if(purpose === 'EmailConfirm') {
        count = await prisma.users.count({
            where: {
                User_Rmuti_Id : rmutiId
            }
        })
    }


    if(count === 1){
        let userData:any
        if(purpose === 'ForgotPassword'){
            userData = await prisma.users.findFirst({
                select:{
                    User_Id: true
                },
                where: {
                    User_Email: email
                }
            })

        }else if(purpose === 'EmailConfirm'){
            userData = await prisma.users.findFirst({
                select:{
                    User_Id: true
                },
                where: {
                    User_Rmuti_Id: rmutiId
                }
            })
        }

        const secret = purpose

        // generate OTP token
        const tokenOTP = speakeasy.totp({
            secret: secret,
            encoding: 'base32'
        })

        // generate expire date
        const expireDate: Date = new Date()
        expireDate.setMinutes(expireDate.getMinutes() + 5)

        await prisma.otp_Confirm.create({
            data: {
                Otp_Confirm_OTP: tokenOTP,
                Otp_Confirm_Expire: expireDate,
                Otp_Confirm_Purpose: purpose,
                Otp_Confirm_Status: false,
                Otp_Confirm_User_Id: Number(userData!.User_Id)
            }
        })

        const sendMail = await sendOtpToMail(email,tokenOTP)
        if(sendMail){
            res.send({
                status: true,
                msg: 'รหัสได้ถูกส่งไปที่ Email แล้ว'
            })
        }else{
            res.send({
                status: false,
                msg: 'ส่ง Email ไม่สำเร็จ'
            })
        }
    }else{
        res.send({
            status: false,
            msg: 'ไม่มี Email นี้ในระบบ'
        })
    }


}

// confirm OTP
module.exports.validateOTP = async (req:Request,res:Response) => {
    const purpose:string = req.body.purpose
    const OTP:string = req.body.OTP
    const email:string = req.body.email

    try{
        const OTPData = await prisma.otp_Confirm.findFirst({
            select:{
                Otp_Confirm_Id:true,
                Otp_Confirm_OTP: true,
                Otp_Confirm_Expire: true,
            },
            where:{
                AND:[
                    {Otp_Confirm_OTP: OTP},
                    {Otp_Confirm_Status: false}
                ]
            }
        })

        if(OTPData){
            const expireDate = OTPData!.Otp_Confirm_Expire
            if(expireDate > new Date()){
                try{
                    await prisma.otp_Confirm.update({
                        data:{
                            Otp_Confirm_Status:true,
                        },
                        where:{
                            Otp_Confirm_Id:OTPData.Otp_Confirm_Id
                        }
                    })

                    res.send({
                        status:true,
                        msg:'การตรวจสอบถูกต้อง'
                    })
                }catch{
                    res.send({
                        status:false,
                        msg:'มีบางอย่างผิดผลาดกับระบบ'
                    })
                }
            }else{
                res.send({
                    status:false,
                    msg:'รหัส OTP หมดอายุ'
                })
            }
        }else{
            res.send({
                status:false,
                msg:'รหัส OTP ไม่ถูกต้อง'
            })
        }
    }catch{
        res.send({
            status:false,
            msg:'มีบางอย่างผิดผลาดกับระบบ'
        })
    }
}

// reset Password
module.exports.resetPassword = async (req:Request , res: Response) => {
    const newPassword: string = req.body.newPassword
    const email: string = req.body.email

    const hashPassword:string = bcrypt.hashSync(newPassword, 10);
    const updatePassword = await prisma.users.update({
        data: {
            User_password: hashPassword
        },
        where:{
            User_Email: email
        },
    })

    if(updatePassword){
        res.send({
            status: true,
            msg: 'เปลี่ยนรหัสผ่านเรียบร้อย'
        })
    }else{
        res.send({
            status: false,
            amsg: 'มีบางอย่างผิดพลาด'
        })
    }
}

