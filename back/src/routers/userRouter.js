import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { routeSanitizer } from "../middlewares/routeSanitizer";
import { userAuthService } from "../services/userService";
import { UserModel } from "../db";

// multer가 파일시스템을 다루기 위해서 필요합니다.
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// 업로드된 파일명을 랜덤한 문자열로 새로 설정하는데 사용됩니다.
const randomstring = require("randomstring");

// multer storage를 설정합니다.
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

// multer upload를 설정합니다.
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

const userAuthRouter = Router();

userAuthRouter.post("/user/register", async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const social = req.body.social;
    const imgUrl = req.body.imgUrl;

    // 이메일 중복 여부 체크하기
    const foundAccount = await UserModel.findOne({ email: email });
    if(foundAccount){
      throw new Error("입력하신 이메일에 해당되는 계정이 이미 존재합니다.");
    }

    // 위 데이터를 유저 db에 추가하기
    const newUser = await userAuthService.addUser({
      name,
      email,
      password,
      social,
      imgUrl,
    });

    if (newUser.errorMessage) {
      throw new Error(newUser.errorMessage);
    }

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post("/user/login", async function (req, res, next) {
  try {
    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 위 데이터를 이용하여 유저 db에서 유저 찾기
    const user = await userAuthService.getUser({ email, password });

    if (user.errorMessage) {
      throw new Error(user.errorMessage);
    }

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.get("/userlist", async function (req, res, next) {
  try {
    // server-side offset pagination을 위한 page와 limit의 초기값을 지정해주고, 쿼리 입력값을 반영해줍니다.
    const { page = 1, limit = 10 } = req.query;
    
    // 전체 사용자 목록을 얻음   
    const paginatedUsers = await userAuthService.getUsers(page, limit);

    if (paginatedUsers.errorMessage) {
      throw new Error(paginatedUsers.errorMessage);
    }

    res.status(200).send(paginatedUsers);

  } catch (error) {
    next(error);
  }
});

userAuthRouter.get(
  "/user/current",
  login_required,
  async function (req, res, next) {
    try {
      // jwt토큰에서 추출된 사용자 id를 가지고 db에서 사용자 정보를 찾음.
      const user_id = req.currentUserId;
      const currentUserInfo = await userAuthService.getUserInfo({
        user_id,
      });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      res.status(200).send(currentUserInfo);
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.put(
  "/users/:id",
  login_required,
  async function (req, res, next) {
    try {
      // URI로부터 사용자 id를 추출함.
      const user_id = req.params.id;
      // body data 로부터 업데이트할 사용자 정보를 추출함.
      const name = req.body.name ?? null;
      const email = req.body.email ?? null;
      const password = req.body.password ?? null;
      const description = req.body.description ?? null;
      const social = req.body.social ?? null;
      const imgUrl = req.body.imgUrl ?? null;

      const toUpdate = { name, email, password, description, social, imgUrl };

      // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함. 업데이트 요소가 없을 시 생략함
      const updatedUser = await userAuthService.setUser({ user_id, toUpdate });

      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.get(
  "/users/:id",
  login_required,
  async function (req, res, next) {
    try {
      const user_id = req.params.id;
      const currentUserInfo = await userAuthService.getUserInfo({ user_id });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      res.status(200).send(currentUserInfo);
    } catch (error) {
      next(error);
    }
  }
);

// jwt 토큰 기능 확인용, 삭제해도 되는 라우터임.
userAuthRouter.get("/afterlogin", login_required, function (req, res, next) {
  res
    .status(200)
    .send(
      `안녕하세요 ${req.currentUserId}님, jwt 웹 토큰 기능 정상 작동 중입니다.`
    );
});


// 임시로 지정한 URL
userAuthRouter.put("/user/:userid/password",
login_required,
async function (req, res, next) {
  try{
    // 현재 로그인한 id. 833396cc~
    const currentUserId=req.currentUserId;
    const userid=req.params.userid
    const email=req.body.email;
    const inputPassword= req.body.inputPassword;
    const newPassword=req.body.newPassword;
    const newPasswordConfirm=req.body.newPasswordConfirm
    const updatedPassword=await userAuthService.setPassword(
      {email,inputPassword,newPassword,newPasswordConfirm}
    )
    // 현재 로그인한 사용자의 id와 url로 전달받은 user_id가 다를 경우 -확인 완료
    if (currentUserId!==userid){
      throw new Error("현재 로그인한 사용자가 아닙니다.")
    }
    if (updatedPassword.error){
      return(updatedPassword.error)
    }
    res.status(200).json(updatedPassword)
  } catch (error) {
    next(error);
  }

})


// 회원 탈퇴를 수행합니다.
userAuthRouter.delete("/user/deletion", routeSanitizer, login_required, async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const currentUserId = req.currentUserId ?? null;
    const inputEmail = req.body.inputEmail ?? null;
    const inputPassword = req.body.inputPassword ?? null;

    const deletedUser = await userAuthService.deleteUser({ currentUserId, inputEmail, inputPassword });

    if (deletedUser.error) {
      throw new Error(deletedUser.error);
    }

    res.status(200).send("사용자 계정 삭제가 완료되었습니다.");
  }
  catch(error){
    next(error);
  }
});


// 비밀번호 초기화를 수행합니다.
userAuthRouter.put("/user/resetpassword", routeSanitizer, async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
    }

    const inputEmail = req.body.inputEmail ?? null;
    const inputProof = req.body.inputProof ?? null;

    const renewedPassword = await userAuthService.resetPassword({ inputEmail, inputProof });

    if (renewedPassword.error) {
      throw new Error(renewedPassword.error);
    }

    res.status(200).send("사용자의 비밀번호 초기화가 완료되었습니다.");
  }
  catch(error){
    next(error);
  }
});


// 현재 로그인한 사용자가 입력한 프로필 사진을 데이터베이스 업로드하고, 해당 사진의 base64 문자열과 MIME type으로 프론트엔드에 보내줍니다.
userAuthRouter.post("/user/:user_id/fileupload", login_required, upload.single('file'), async function (req, res, next) {
  try {
    const currentUserId = req.currentUserId;

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
    
    // Hex 형식으로 Buffer에 들어있는 이미지 데이터를 base64 형식으로 바꿔줍니다.
    const imgBase64 = new Buffer.from(fileObject["file"]["data"]).toString('base64');

    // mongoose를 사용해서 이미지 데이터 객체를 사용자 계정 document에 포함시켜줍니다.
    const uploadedFile = await UserModel.findOneAndUpdate({ id: currentUserId }, { imgBase64: imgBase64 }, { returnOriginal: false });

    if (uploadedFile.error) {
      throw new Error(uploadedFile.error);
    }

    // 파일이 정상적으로 DB에 저장이 되었다면 multer storage에 보관되어 있는 임시 파일을 삭제해줍니다.
    // 그렇지 않으면 임시 파일이 uploads 폴더에 계속 쌓이게 됩니다.
    // 파일 삭제에 사용되는 fs.unlink는 callback-style API이므로 결과를 적절하게 비동기적으로 핸들링해줍니다.
    const clearMulterStorage = fs.unlink(path.join(__dirname, '../uploads/') + req.file.filename, function resultHandler (err) {
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


export { userAuthRouter };
