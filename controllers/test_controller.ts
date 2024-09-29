import { Request, Response } from "express";
import { faker} from '@faker-js/faker'
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

module.exports.test_Users = (req:Request,res:Response) => {
    interface User {
        id: number ,
        avatar: string ,
        firstName :string ,
        lastName :string ,
        birthDate : Date ,
    }

    const users : User[] = []
    for(let i = 1 ; i <= 200; i++ ){
        users.push({
            id: i,
            avatar: faker.image.cats(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            birthDate: faker.date.past(80)
        })
    }

    const page = req.query.page ? +req.query.page : 1
    const perPage = req.query.perPage ? +req.query.perPage : 10

    res.send({
        usersData : users.slice((page-1)*perPage, page*perPage) ,
        total : users.length
    })
}

