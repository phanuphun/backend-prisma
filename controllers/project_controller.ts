import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { Request , Response } from "express";
import path from "path";
import { ProjectStatus } from "../model/types";
require('dotenv').config()

const prisma = new PrismaClient()

// CREATE PROJECT
module.exports.createNewProject = async (req:Request, res:Response) => {

    const projectNameTH:string = req.body.projectNameTH
    const projectNameEN:string = req.body.projectNameEN
    const projectDetail:string = req.body.projectDetail || ''
    const createdBy:number = req.body.createdBy // user id
    const userRoles:string[] = req.body.userRoles
    const createdDate:Date = new Date()
    const projectStatus:number = 1

    if(userRoles.includes('นักศึกษา')){
        // create new project
        await createNewProject()

        // get project id for add in owner table
        const newProjectId = await prisma.project.findFirst({
            select: {
                Project_Id: true
            },
            where: {
                Project_Created_By: createdBy
            },
            orderBy: {
                Project_Id: 'desc'
            }
        })

        try{
            // add owner
            await prisma.project_Owner.create({
                data: {
                    Project_Owner_Project_Id: newProjectId!.Project_Id,
                    Project_Owner_User_Id: createdBy
                }
            })
            res.send({
                status: true,
                msg: 'สร้างโครงการสำเร็จแล้ว'
            })
        }catch(err){
            console.log(err);

            res.send({
                status: false,
                msg: 'มีบางอย่างผิดพลาดขณะเพิ่มผู้รับผิดชอบโครงการ'
            })
        }
    }else{
        await createNewProject()
        res.send({
            status: true,
            msg: 'สร้างโครงการสำเร็จแล้ว'
        })
    }

    async function createNewProject(){
        try{
            await prisma.project.create({
                data: {
                    Project_Name_TH: projectNameTH,
                    Project_Name_EN: projectNameEN,
                    Project_Detail: projectDetail,
                    Project_Created_By: createdBy,
                    Project_Created_Date: createdDate,
                    Project_Status: projectStatus,
                    Project_Deleted: false,
                    Project_Avatar: faker.image.fashion()
                }
            })
        }catch(err){
            console.log(err);
            res.send({
                status: false,
                msg: 'มีบางอย่างผิดพลาดขณะสร้างโครงการ'
            })
        }
    }
}

// GET PROJECT DATA
module.exports.checkUserProject = async (req:Request,res:Response)  => {
    const userId:number = req.body.userId
    const projectCount = await prisma.project_Owner.count({
        where:{
            Project_Owner_User_Id: userId
        }
    })

    // have project
    if(projectCount >= 1 ){
        try{
            let projectDetail = await prisma.project_Owner.findMany({
                include:{
                    PROJECTS:{
                        include:{
                            PROJECT_STATUS_ID:true
                        }
                    }
                },
                where:{
                    Project_Owner_User_Id:userId
                }
            })

            // owner and advisor  lsit . . .
            let usersId:number[] = []
            let ownerData:Object[] = []
            let advisorData:any[] = []

            for(let i = 0 ; i < projectDetail.length ; i++){
                usersId.push(projectDetail[i].Project_Owner_User_Id)
            }

            // map project data
            projectDetail = projectDetail.map((data:any)=>{
                data.PROJECTS.Project_Status = data.PROJECTS.PROJECT_STATUS_ID
                delete data.PROJECTS.PROJECT_STATUS_ID
                return data.PROJECTS
            })

            let projectData:any = projectDetail[0]
            await getuserData('owner')
            // clear id in arr
            usersId.length = 0

            // get advisor
            advisorData = await prisma.project_Advisor.findMany({
                where:{
                    Project_Advisor_Project_Id:projectData.Project_Id
                }
            })

            for(let i = 0 ; i < advisorData.length ; i++){
                usersId.push(advisorData[i].Project_Advisor_User_Id)
            }

            advisorData.length = 0
            await getuserData('advisor')


            res.send({
                status: true,
                projectCount:projectCount,
                projectData: projectData,
                ownerData: ownerData,
                advisorData: advisorData
            })

            async function getuserData(purpose: 'owner' | 'advisor'){
                for(let i = 0 ; i < usersId.length ; i++){
                    let userData:any = await prisma.users.findMany({
                        where: {
                            User_Id:usersId[i]
                        },
                        include:{
                            USER_ROLES:{
                                include:{
                                    ROLE_ID:true
                                }
                            },
                        }
                    })
                    if(purpose === 'owner') {
                        ownerData.push(userData[0])
                    }
                    if(purpose === 'advisor') {
                        advisorData.push(userData[0])
                    }
                }

            }

        }catch{
            res.send({
                status:false,
                projectCount:projectCount,
                msg: 'เกิดข้อผิดพลาดขณะดึงข้อมูลโครงการของผู้ใช้งาน'
            })
        }

    }else{
        res.send({
            status:true,
            projectCount:projectCount
        })
    }
}

// INVITE ADVISOR
module.exports.inviteAdvisor = async(req:Request,res:Response) => {

    if(req.file === undefined){
        res.send({
            status:false,
            msg:'ส่งข้อเสนอไม่สำเร็จ ตรวจไม่พบไฟล์ที่แนบมา'
        })
    }
    const projectId:number = +req.body.projectId
    const inviterId:number = +req.body.inviterId
    const acceptorId:number = +req.body.acceptorId
    const detail:string = req.body.detail || ''
    const proposalFile:string = req.file?.filename!

    const projectStatus = await prisma.project.findFirst({
        select:{
            Project_Status: true
        },
        where:{
            Project_Id: projectId
        }
    })

    if(projectStatus?.Project_Status !== 2){
        try{
            await prisma.project_Invite_Advisor.create({
                data:{
                    Project_Invite_Advisor_Project_Id: projectId,
                    Project_Invite_Advisor_Inviter: inviterId,
                    Project_Invite_Advisor_Acceptor: acceptorId,
                    Project_Invite_Advisor_Detail: detail,
                    Project_Invite_Advisor_File: proposalFile,
                    Project_Invite_Advisor_Reply_Status: 0,
                    Project_Invite_Advisor_Reply_Msg: ''
                }
            })

            await prisma.project.update({
                data:{
                    Project_Status: 2
                },where:{
                    Project_Id: projectId
                }
            })

            res.send({
                status:true,
                msg:'เสนอหัวข้อโครงการไปยังอาจารย์แล้ว'
            })
        }catch{
            res.send({
                status:false,
                msg:'มีบางอย่างผิดพลาดขณะเสนอหัวข้อโครงการ'
            })
        }
    }else if(projectStatus?.Project_Status === 2){
        res.send({
            status:false,
            msg:'โครงการอยู่ระหว่างการเสนอแล้ว'
        })
    }

}

// INVITE ADVISOR LIST
module.exports.inviteAdvisorList = async(req:Request , res:Response) =>{
    const acceptorId = req.body.acceptorId

    let inviteAdvisorList =  await prisma.project_Invite_Advisor.findMany({
        include:{
            PROJECT:true
        },
        where:{
            Project_Invite_Advisor_Acceptor: acceptorId
        },
        orderBy: {
            Project_Invite_Advisor_Id: 'desc'
        }
    })

    inviteAdvisorList.map(async(inviteItem:any)=>{
        inviteItem.project = inviteItem.PROJECT
        delete inviteItem.PROJECT
        return inviteItem
    })

    res.send({
        status:true,
        inviteAdvisorList:inviteAdvisorList
    })
}

// REPLY INVITE ADVISOR
module.exports.replyInviteAdvisor = async (req:Request,res:Response) => {
    const replyMsg:string = req.body.replyMsg
    const replyStatus: 1 | 2 = req.body.replyStatus as 1 | 2 // 1. accept 2. denied
    const inviteAdvisorId:number = req.body.inviteAdvisorId
    const projectId:number = req.body.projectId
    const advisorId:number = req.body.advisorId
    try{
        await prisma.project_Invite_Advisor.update({
            data:{
                Project_Invite_Advisor_Reply_Msg:replyMsg,
                Project_Invite_Advisor_Reply_Status:replyStatus,
            },
            where:{
                Project_Invite_Advisor_Id:inviteAdvisorId
            }
        })

        if(replyStatus === 1){
            await updateStatus(3) // next progress project
        }else if(replyStatus ===2){
            await updateStatus(1) // rollback first step
        }

        if(replyStatus === 1){
            await prisma.project_Advisor.create({
                data:{
                    Project_Advisor_Role: 1, // 1. main teacher 2. sub teacher
                    Project_Advisor_Project_Id: projectId,
                    Project_Advisor_User_Id: advisorId
                }
            })
        }

        res.send({
            status:true,
            msg:'ตอบกลับเรียบร้อยเเล้ว'
        })
    }catch(err){
        console.log(err);
        res.send({
            status:false,
            msg:'มีบางอย่างผิดพลาดขณะอัพเดตข้อมูล'
        })
    }

    async function updateStatus(projectStatus:ProjectStatus){
        try{
            await prisma.project.update({
                data:{
                    Project_Status: projectStatus
                },
                where:{
                    Project_Id: projectId
                }
            })

         }catch(err){
            console.log(err);
            res.send({
                status:false,
                msg:'มีบางอย่างผิดพลาดขณะอัพเดตข้อมูล'
            })
        }
    }
}

// DOWNLOAD PROPOSAL
module.exports.downloadProposal = async(req:Request,res:Response) =>{
    const fileName = req.body.fileName
    const filePath = path.join(__dirname, String(process.env.PROPOSAL_PATH),fileName)

    res.download(filePath, fileName, (err)=>{
        if (err) {
            console.error(err);
            res.send({
                status:false,
                msg:'มีบางอย่างผิดพลาดขณะดาวน์โหลดไฟล์'
            });
        }
    })

    // res.sendFile(filePath, (err) => {
    //     if (err) {
    //         console.error(err);
    //         res.send({
    //             status:false,
    //             msg:'มีบางอย่างผิดพลาดขณะดาวน์โหลดไฟล์'
    //         });
    //     }
    // })
}
