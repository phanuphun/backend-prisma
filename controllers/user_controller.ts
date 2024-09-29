import { PrismaClient } from "@prisma/client";
import { objectEnumValues } from "@prisma/client/runtime";
import { Request , Response} from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

module.exports.getAllUserByRole = async (req:Request , res:Response) => {
    const role: number | 'all' = req.body.role
    // query data
    try{
        if(role !== 'all'){
            const studentList = await prisma.users.findMany({
                include:{
                    USER_ROLES:{
                        select:{
                            ROLE_ID: {
                                select:{
                                    Role_Id:true,
                                    Role_Name:true,
                                }
                            }
                        },
                    },
                } ,
                where: {
                    AND: [
                        {
                            USER_ROLES: {
                                some: {
                                    User_Roles_Role_id: role
                                },

                            }
                        }
                    ],
                    NOT: [
                        {
                            USER_ROLES: {
                                some: {
                                    User_Roles_Role_id: 3
                                },
                            }
                        }
                    ]
                },
                orderBy: {
                    User_Id: 'desc'
                }
            })

            // map new data
            studentList.map((Student : any)=>{
                // rename USER_ROLES => User_Roles
                Student['User_Roles'] = Student['USER_ROLES']
                delete Student['USER_ROLES'];

                // get length
                const Roleslength = Student.User_Roles.length;

                // backup data
                let backupRoles:Array<{}>= []
                for(let i = 0 ; i < Roleslength ; i++){
                    backupRoles.push({
                        Role_Id:Student.User_Roles[i].ROLE_ID.Role_Id,
                        Role_Name:Student.User_Roles[i].ROLE_ID.Role_Name
                    })
                }

                //clear old data
                Student.User_Roles.length = 0

                //set new data
                for(let i = 0 ; i < Roleslength ; i++){
                    Student.User_Roles.push(backupRoles[i])
                }

            })
            res.send({
                status:true,
                studentList:studentList
            })
        }
    }catch{
        res.send({
            status:true,
            msg:'มีบางอย่างผิดพลาดขณะโหลดรายชื่อ'
        })
    }
}

module.exports.getUserData = async (req:Request , res:Response) => {
    const userId = req.body.userId
    try{
        let userData:any = await prisma.users.findMany({
            where: {
                User_Id:userId
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

        res.send({
            userData: userData[0][0],
            status: true,
            msg:'ดึงข้อมูลผู้ใช้งานสำเร็จ'
        })
    }catch(err){
        res.send({
            status: false,
            msg:'มีบางอย่างผิดพลาดขณะดึงข้อมูลผู้ใช้งาน กรุณาลองใหม่ภายหลังหรือแจ้งผู้ดูแลระบบ'
        })
    }
}

module.exports.updateUserData = async (req:Request , res:Response) => {
    const userId:number = req.body.userId
    const username: string = req.body.username
    const fname: string = req.body.fname
    const lname: string = req.body.lname
    const abouteMe: string = req.body.abouteMe
    const phone: string = req.body.phone

    try{
        await prisma.users.update({
            data:{
                User_Usernname:username,
                User_Fname:fname,
                User_Lname:lname,
                User_AboutMe:abouteMe,
                User_Phone:phone
            },
            where:{
                User_Id: userId
            }
        })

        res.send({
            status:true,
            msg: 'บันทึกข้อมูลเรียบร้อย'
        })
    }catch{
        res.send({
            status:false,
            msg: 'มีบางอย่างผิดพลาดขณะบันทึกข้อมูล'
        })
    }
}

module.exports.updateEmail = async(req:Request , res:Response) => {
    const userId:number = req.body.userId
    const email:string = req.body.email

    try{
        await prisma.users.update({
            data:{
                User_Email:email
            },
            where:{
                User_Id:userId
            }
        })

        res.send({
            status:true,
            msg: 'อัพเดตอีเมลเรียบร้อย'
        })

    }catch{
        res.send({
            status:false,
            msg: 'มียางอย่างผิดพลากขณะอัพเดตอีเมล'
        })
    }
}

module.exports.confirmPassword =async (req:Request,res:Response) => {
    const userId:number = req.body.userId
    const password:string = req.body.password

    try{
        // get hash password from db
        const hashPassword:any = await prisma.users.findFirst({
            select: {
                User_password: true
            },
            where: {
                User_Id: userId
            }
        })
        const isPasswordRight = await validatePassword(String(hashPassword.User_password))

        // check hash password
        if(isPasswordRight){
            res.send({
                status:true,
                msg:'รหัสผ่านถูกต้อง'
            })
        }else{
            res.send({
                status:false,
                msg:'รหัสผ่านไม่ถูกต้อง'
            })
        }

    }catch(err){
        console.log(err);
        res.send({
            status:false,
            msg:'มีบางอย่างผิดพลาดขณะตรวจสอบรหัสผ่าน'
        })
    }

   async function validatePassword(hashPassword:string):Promise<boolean>{
    return bcrypt.compareSync(password,hashPassword)
   }

}
