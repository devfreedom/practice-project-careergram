import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import {Certification} from "../db/models/Certificate"
import {routeSanitizer} from "../middlewares/routeSanitizer"
import { CertificateModel } from "../db/schemas/certificate";

const certificateRouter = Router();
const mongoose = require('mongoose');

const path = require('path');

// multer storage에 있는 파일을 지우는데 사용하기 위해 fs.unlink를 promisify() 합니다.
// Node 10.23.1 버전부터는 아래의 형식을 지원합니다.
const fs = require('fs');
const multer = require('multer');
const randomstring = require("randomstring");

// multer를 설정합니다.
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // [주의] path 모듈을 활용해 절대 경로를 기반으로 추가적인 상대 경로를 조합해주어야 합니다.
    //       - 현재 working directory는 /back/src/routers/ 입니다.
    //       - working directory의 절대 경로에다가 ../uploads/ 라는 상대 경로를 추가해줍니다.
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + randomstring.generate() + ".jpg")
  }
})

// [보안] 업로드된 파일의 MIME type을 감지해서 JPEG 형식의 이미지 파일만 받아들입니다. 테스트 완료.
let upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpg|jpeg/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb('JPG 파일만 업로드 가능합니다.');
    }
  },
 });
// Create
certificateRouter.post("/users/:userid/certificates",login_required,routeSanitizer,async (req, res)=> {
  //이때의 id는 유저의 id입니다. (_id 아님)
  // _id는 자동으로 생성됩니다.
  try {
      const userId=req.params.userid;
      const newCertificate=await Certification.create({
        userId:userId,
        title:req.body.title,
        issuer:req.body.issuer,
        certDate:req.body.certDate,
        expDate:req.body.expDate,
        certId:req.body.certId,
        description:req.body.description
      })
      const savedCertificate = await newCertificate.save();
      res.send({success:true});
    }
    catch (error) {
    res.status(500).json({ error: error.message });
  }
  // 전달 완료!
}
);

//Read
certificateRouter.get("/users/:userid/certificates",
    async function (req, res) {
      try{
         const userId=req.params.userid
        //이때의 id는 유저의 id입니다. 잘 불러와질지...
        const certificateList=await Certification.findById({userId})

        // id를 기반으로 사용자의 자격증 목록을 불러오고자 함
        res.status(200).json(certificateList)
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
)

//Update
certificateRouter.put("/certificates/:documentid",login_required,routeSanitizer,async(req,res)=>{
  const certDocId=req.params.documentid;
  const updateData=req.body;

  const updateCertificate=await Certification.updateOne(
    {certDocId:certDocId},updateData)
    if(!updateCertificate){
      return res.status(500).json({ error: error.message });
    }
    res.status(200).send({success:true});
})


//Delete
certificateRouter.delete("/certificates/:documentid",login_required,routeSanitizer, routeSanitizer,
async (req,res)=>{
  const certDocId=req.params.documentid
  try {   
    const delCertificate=await Certification.deleteOne({certDocId})
    res.status(200).send({success:true});
  }catch(error){
    res.status(500).json({ error: error.message });
  }

})



// 현재 로그인한 사용자가 입력한 프로필 사진을 데이터베이스 업로드하고, 해당 사진의 base64 문자열과 MIME type으로 프론트엔드에 보내줍니다.
certificateRouter.post("/certificates/:docid/fileupload", upload.single('file'), login_required, async function (req, res, next) {
  try {
    const currentUserId = req.currentUserId;
    const docId=req.params.docid
    if(!currentUserId){
      throw new Error("현재 로그인한 사용자를 알 수 없습니다.");
    }

    // 사용자가 업로드한 파일이 multer storage에 저장이 되어 있으므로 이 데이터를 객체 변수에 담아 mongoose가 다룰 수 있도록 해줍니다.
    // [주의] path 모듈을 활용해 절대 경로를 기반으로 추가적인 상대 경로를 조합해주어야 합니다.
    //       - 현재 working directory는 /back/src/routers/ 입니다.
    //       - working directory의 절대 경로에다가 ../uploads/ 라는 상대 경로를 추가해줍니다.
    //       - multer의 storage와 같은 경로를 사용해야 합니다.
    const fileObject = {
      file: {
        data: fs.readFileSync(path.join(__dirname, '../uploads/') + req.file.filename),
        contentType: 'image/jpg',
      }
    }
    const imgBase64 = new Buffer.from(fileObject["file"]["data"]).toString('base64');


    // mongoose를 사용해서 이미지 데이터 객체를 사용자 계정 document에 포함시켜줍니다.
    const uploadedFile = await CertificateModel.findOneAndUpdate({ _id: docId }, { imgBase64: imgBase64 },
      { returnOriginal: false });

    if (uploadedFile.error) {
      throw new Error(uploadedFile.error);
    }


    // 파일이 정상적으로 DB에 저장이 되었다면 multer storage에 보관되어 있는 임시 파일을 삭제해줍니다.
    // 그렇지 않으면 임시 파일이 uploads 폴더에 계속 쌓이게 됩니다.
    // 파일 삭제에 사용되는 fs.unlink는 callback-style API이므로 결과를 적절하게 비동기적으로 핸들링해줍니다.
    const clearMulterStorage = fs.unlink(path.join(__dirname, '../uploads/') + req.file.filename, 
    function resultHandler (err) {
      if (err) {
          console.log("업로드된 임시 파일 삭제에 실패했습니다: ", err);
      } else {
          console.log("업로드된 임시 파일을 삭제했습니다.");
      }
    });
    


    res.status(200).json(imgBase64);
  }
  catch(error){
    next(error);
  }
});


export { certificateRouter}
