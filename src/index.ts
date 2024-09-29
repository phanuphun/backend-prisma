import express from 'express'
import path from 'path';
import { Request, Response } from 'express';
const app = express()
const routes = require('../routes/route')


app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use('/api', express.static('/public'))

// Set the path to the frontend dist folder
const distPath = path.resolve('front_end');
app.use(express.static(distPath));

app.use('/api',routes)

app.get('*', (req:Request, res:Response) => {
    res.sendFile(path.join(distPath,'index.html'));
});

app.listen(4000,()=>{
    console.log(' backend start at port 4000');
})
