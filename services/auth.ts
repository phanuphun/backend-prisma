import { NextFunction, Request , Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
require('dotenv').config()

// check request header is token in ?
module.exports.isTokenInHeader = async (req:Request,res:Response,next:NextFunction) => {
    const token = String(req.headers.authorization).split(' ')[1]

    if(typeof token !== 'undefined' && token !=='' ){
        const varifyToken = jwt.verify(token,String(process.env.JWT_PRIVATE_KEY),(err,result)=>{
            if(err){
                res.send({
                    status:false ,
                    msg: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
                })
            }else{
                next()
            }
        })
    }else{
        res.send({
            status:false ,
            msg: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
        })
    }
}

// check token is token expried ?
module.exports.isTokenExpied = async (req:Request, res:Response) => {
    const token = req.body.token
    const decoded = jwt.decode(token) as JwtPayload

    // ถ้า decoded ไม่มีค่าให้ return err ออกไป
    if(!decoded){
        res.send({
            status: false ,
            msg: 'Token Invalid or Token Expired '
        })
    }

    // get current date is type number because decode.exp is a number type
    const currentTime = new Date().getTime() / 1000

    if(decoded.exp! <= currentTime){
        res.send({
            status: false ,
            msg: 'หมดเวลาการใช้งาน กรุณาเข้าสู่ระบบใหม่'
        })
    }else{
        res.send({
            status: true ,
            msg: 'ยังไม่หมดอายุการใช้งาน'
        })
    }
}
