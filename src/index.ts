import express from 'express'
import { faker} from '@faker-js/faker'

const app = express()

interface User {
    id:number ,
    firstName :string ,
    lastName :string ,
    birthDate : Date 
}

const users : User[] = [] 

    for(let i = 1 ; i <= 1000000; i++ ){
        users.push({
            id: i,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            birthDate: faker.date.past(80)
        })
    }

app.get('/users' , (req,res)=>{

    const page = req.query.page ? +req.query.page : 1
    const perPage = req.query.perPage ? +req.query.perPage : 10
    
    res.send({
        usersData : users.slice((page-1)*perPage, page*perPage) ,
        total : users.length
    })
})

app.listen(4000,()=>{
    console.log(' backend start at port 4000');
})