import multer from "multer";
import path from "path";
import dayjs from "dayjs";

const storage = multer.diskStorage({

    destination (req, file, next) {
        next(null, path.join(__dirname,  String(process.env.PROPOSAL_PATH)))
    },
    filename (req,file,next){
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
        next(null, `${file.fieldname}_${dayjs().format('DDMMMMYYYY')}_${Math.round(Math.random()*1000)}_${file.originalname}`)
    },
})

// export const upload = multer({
//     dest: path.join(__dirname , '../public/proposal')
// })
export const upload = multer({
    storage:storage,
})
