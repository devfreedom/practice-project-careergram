import { User, UserModel } from "../db"; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.

// 회원 탈퇴시 다른 콜렉션에 있는 문서들도 일괄적으로 함께 삭제하기 위해서 필요합니다.
import { AwardModel } from "../db/schemas/award";
import { CertificateModel } from "../db/schemas/certificate";
import { EducationModel } from "../db/schemas/education";
import { ProjectModel } from "../db/schemas/project";
import { TextboardModel } from "../db/schemas/textboard";

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
const randomstring = require("randomstring");
require('dotenv').config();

const OAuth2 = google.auth.OAuth2;

class userAuthService {
  static async addUser({ name, email, password, social, imgUrl }) {
    // 이메일 중복 확인
    const user = await User.findByEmail({ email });
    if (user) {
      const errorMessage =
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.";
      return { errorMessage };
    }

    // 비밀번호 해쉬화
    const hashedPassword = await bcrypt.hash(password, 10);

    // id 는 유니크 값 부여
    const id = uuidv4();
    const newUser = { id, name, email, social, imgUrl, password: hashedPassword };

    // db에 저장
    const createdNewUser = await User.create({ newUser });
    createdNewUser.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.

    return createdNewUser;
  }

  static async getUser({ email, password }) {
    // 이메일 db에 존재 여부 확인
    const user = await User.findByEmail({ email });
    if (!user) {
      const errorMessage =
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );
    if (!isPasswordCorrect) {
      const errorMessage =
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
    const token = jwt.sign({ user_id: user.id }, secretKey);

    // 반환할 loginuser 객체를 위한 변수 설정
    const id = user.id;
    const name = user.name;
    const description = user.description;
    const social = user.social;
    const imgUrl = user.imgUrl;

    const loginUser = {
      token,
      id,
      email,
      name,
      description,
      social,
      imgUrl,
      errorMessage: null,
    };

    return loginUser;
  }

  // Server-side offset pagination이 반영된 서비스입니다.
  static async getUsers(page, limit) {
    try{
      // 전체 사용자 계정 수를 파악합니다.
      // User가 아닌 UserModel의 mongoose 내장 메서드들을 사용합니다.
      const totalCount = await UserModel.find({}).count();

      // 지정된 조건으로 사용자 계정 정보를 일정 단위로 끊어서 가져옵니다.
      // User가 아닌 UserModel의 mongoose 내장 메서드들을 사용합니다.
      const users = await UserModel.find({})
        .sort({ name: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const paginatedUsers = {
        users,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page
      }

      return paginatedUsers;
    }
    catch(error){
      throw new Error(error);
    }
  }

  static async setUser({ user_id, toUpdate }) {
    // 우선 해당 id 의 유저가 db에 존재하는지 여부 확인
    let user = await User.findById({ user_id });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage = "가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 업데이트 대상에 name이 있다면, 즉 name 값이 null 이 아니라면 업데이트 진행
    if (toUpdate.name) {
      const fieldToUpdate = "name";
      const newValue = toUpdate.name;
      user = await User.update({ user_id, fieldToUpdate, newValue });
    }

    if (toUpdate.email) {
      const fieldToUpdate = "email";
      const newValue = toUpdate.email;
      user = await User.update({ user_id, fieldToUpdate, newValue });
    }

    if (toUpdate.password) {
      const fieldToUpdate = "password";
      const newValue = bcrypt.hash(toUpdate.password, 10);
      user = await User.update({ user_id, fieldToUpdate, newValue });
    }

    if (toUpdate.description) {
      const fieldToUpdate = "description";
      const newValue = toUpdate.description;
      user = await User.update({ user_id, fieldToUpdate, newValue });
    }

    if (toUpdate.social) {
      const fieldToUpdate = "social";
      const newValue = toUpdate.social;
      user = await User.update({ user_id, fieldToUpdate, newValue });
    }

    if (toUpdate.imgUrl) {
      const fieldToUpdate = "imgUrl";
      const newValue = toUpdate.imgUrl;
      user = await User.update({ user_id, fieldToUpdate, newValue });
    }

    return user;
  }

  static async getUserInfo({ user_id }) {
    const user = await User.findById({ user_id });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage =
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return user;
  }


  //폼으로 이메일,입력받은 기존 비밀번호, 새로운 비밀번호를 입력받음
  static async setPassword({email,inputPassword,newPassword,newPasswordConfirm}){
    
    // 이메일로 db에서 일치하는 사용자의 정보를 가져옴
    let user=await User.findByEmail({email})

    // 사용자의 정보가 없을 경우
    if (!user) {
      throw new Error( "가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
      ;
    }
    
    // 입력받은 기존 비밀번호가 없을 경우
    if (!inputPassword){
      throw new Error( "기존 비밀번호를 입력해주세요.");
      ;
    }
    
    const isPasswordCorrect = await bcrypt.compare(
      inputPassword,
      user.password
    );
    const newPasswordHashed=await bcrypt.hash(newPassword,10)

    const filter = { id: user.id };
    const update = { ["password"]: newPasswordHashed };
    const option = { returnOriginal: false };
    const updatedUser = await UserModel.findOneAndUpdate(
      filter,
      update,
      option
    );
    
    // 기존 비밀번호가 사용자의 정보에 저장된 비밀번호와 다른 경우 -확인 완료
    // 보안부분이 추가되어야 할 것 같음
    if (!isPasswordCorrect){
      throw new Error( "기존 비밀번호를 잘못 입력했습니다. 다시 한 번 확인해 주세요");
      ;
    }
    
    // 새로운 비밀번호가 입력되지 않았을 경우-확인 완료
    if (!newPassword){
      throw new Error( "새로운 비밀번호를 입력해주세요.");
      ;
    }
    
    // 새로운 비밀번호의 글자수가 5글자 이하, 13글자 이상일 경우 -확인 완료
    if (newPassword.length<4||newPassword.length>12){
      throw new Error( "비밀번호는 6글자 이상 12글자 이하여야 합니다.");
      ;
    }
    if (!newPasswordConfirm){
      throw new Error( "새로운 비밀번호를 확인하기 위해 한번 더 입력해주세요.");
      ;
    }
    if(newPassword!==newPasswordConfirm){
      throw new Error("새로운 비밀번호가 확인되지 않았습니다.")
      
    }
    // 변수를 유저모델과 일치시키니 실행되어 일단 임의로 변수 지정해서 값 넣어줌
    return "변경이 완료되었습니다."
  }

  
  // 로그인한 사용자가 신청한 회원 탈퇴 작업을 수행하는 기능을 구현합니다.
  static async deleteUser({ currentUserId, inputEmail, inputPassword }){
    try{
      if(!inputEmail) {
        throw new Error("현재 로그인한 사용자의 이메일을 입력하세요.");
      }

      if(!inputPassword) {
        throw new Error("현재 로그인한 사용자의 비밀번호를 입력하세요.");
      }

      if(!currentUserId) {
        throw new Error("현재 로그인한 사용자를 알 수 없으므로 탈퇴를 진행할 수 없습니다.");
      }
      console.log(`Running on deleteUser. ${currentUserId}, ${inputEmail}, ${inputPassword}`);
      // 현재 로그인한 사용자의 currentUserId로 사용자 계정 document를 찾습니다.
      // [버그] User 모델의 User.findById가 전혀 작동하지 않고 있습니다. mongoose 자체 메서드인 findOne을 대신 사용합니다.
      // const targetDocument = await User.findById(currentUserId);
      const targetDocument = await UserModel.findOne({ id: currentUserId });

      if(!targetDocument){
        throw new Error("현재 로그인한 사용자의 정보로는 계정 정보를 찾을 수 없거나, 이미 삭제된 계정입니다.");
      }
      console.log(`targetDocument: ${targetDocument}`)
      // [보안] 삭제를 요청한 사용자와, 계정 document의 소유자가 일치하는지를 validate 합니다.
      if(currentUserId !== targetDocument.id){
        throw new Error("현재 로그인한 사용자는 사용자 계정 정보를 삭제할 권한이 없습니다.");
      }

      // [보안] 입력된 비밀번호와 실제 사용자 계정 document에 들어있는 hash를 비교합니다.
      const isPasswordCorrect = await bcrypt.compare(
        inputPassword,
        targetDocument.password
      );

      if (!isPasswordCorrect) {
        throw new Error("비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.");
      }

      // validation이 통과되었다면 사용자 계정 document를 삭제합니다.
      // [버그] User 모델의 User.delete가 전혀 작동하지 않고 있습니다. mongoose 자체 메서드인 findOneAndDelete를 대신 사용합니다.
      // const deletedUser = await User.delete(currentUserId);
      const deletedUser = await UserModel.findOneAndDelete({ id: currentUserId });

      // 로그인한 사용자가 소유한 다른 콜렉션의 document들도 함께 삭제합니다.
      const deletedAwards = await AwardModel.deleteMany({ userId: currentUserId });
      const deletedCertificates = await CertificateModel.deleteMany({ userId: currentUserId });
      const deletedEducations = await EducationModel.deleteMany({ userId: currentUserId });
      const deletedProjects = await ProjectModel.deleteMany({ userId: currentUserId });
      const deletedTextboards = await TextboardModel.deleteMany({ userId: currentUserId });
      
      // document 삭제 작업을 일괄적으로 처리해줍니다.
      Promise.all([deletedUser, deletedAwards, deletedCertificates, deletedEducations, deletedProjects, deletedTextboards])
        .then((values) => { 
          return "사용자 계정 정보 및 사용자 계정과 연결된 모든 문서를 삭제했습니다.";
        })
        .catch((error) => {
          return `오류가 발생했습니다: ${error}`;
        });
        
    }
    catch(error){
      throw new Error(error);
    }
  }

  
  // 잊어버린 비밀번호를 초기화하는 기능을 구현합니다.
  static async resetPassword({ inputEmail, inputProof }){
    try{
      if(!inputEmail) {
        throw new Error("현재 로그인한 사용자의 이메일을 입력하세요.");
      }

      if(!inputProof) {
        throw new Error("본인임을 증명할 수 있는 계정 정보 항목 중 하나를 입력하세요.");
      }

      // GMail API를 사용하기 위한 클라이언트를 설정합니다.
      const createTransporter = async () => {
        const oauth2Client = new OAuth2(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          "https://developers.google.com/oauthplayground"
        );
      
        oauth2Client.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN
        });
      
        const accessToken = await new Promise((resolve, reject) => {
          oauth2Client.getAccessToken((err, token) => {
            if (err) {
              console.log(err);
              reject();
            }
            resolve(token);
          });
        });
      
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
          }
        });

        return transporter;
      };

      // 만약 unauthorized client 오류가 발생하면 다음 코드를 사용합니다.
      /*
      tls: {
        rejectUnauthorized: false
      }
      */

      // 이메일을 전송하는 함수를 구현합니다.
      const sendEmail = async (emailOptions) => {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
      };

      // 새로운 랜덤 비밀번호를 생성합니다.
      const newPassword = randomstring.generate();

      const targetDocument = await UserModel.findOne({ email: inputEmail });

      if(!targetDocument) {
        throw new Error("입력하신 이메일에 해당하는 계정 정보를 찾을 수 없습니다.");
      } 

      const targetDocumentId = targetDocument['id'];

      // [사용금지] 프론트엔드에서 넘어오는 입력값은 sanitized 되어 있으므로, 특수문자가 들어가는 SNS 주소 등은 validation에 사용할 수 없는 상황입니다.
      // 본인임을 인증할 수 있는 정보가 실제 문서에 포함되어 있는지를 검증합니다. 
      /*
      const referenceDocument = Object.values(targetDocument)[2];
      const evidences = Object.values(referenceDocument)
      
      if(!evidences.includes(inputProof)) {
        throw new Error("본인임을 인증하는 입력값에 해당하는 계정 정보를 찾을 수 없습니다.");        
      }
      */

      // 현재 휴대폰 본인인증 등의 기능이 없으므로 일단 사용자 이름으로만 본인인증을 진행합니다.
      if(inputProof !== targetDocument["name"]) {
        throw new Error("입력하신 정보로는 계정 정보를 찾을 수 없습니다.");
      }

      // [보안] 생성된 랜덤 비밀번호를 DB에 저장하기 전에 hash 처리를 해줍니다.
      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      // 사용자의 비밀번호가 초기화되었다는 플래그를 함께 담아서 문서를 업데이트합니다.
      const updatedUserData = {
        "password" : newHashedPassword,
        "isPasswordReset" : true,
      }

      const filter = { id: targetDocumentId };
      const update = { $set: updatedUserData };
      const option = { returnOriginal: false };

      const updatedTargetDocument = await UserModel.findOneAndUpdate(
        filter,
        update,
        option
      );
      
      // 이메일을 실제로 전송합니다.
      sendEmail({
        subject: "요청하신 비밀번호 초기화가 완료되었습니다.",
        text: `안녕하세요 회원님! 비밀번호가 초기화되었습니다. 새로 발급해드린 비밀번호를 사용해서 다시 로그인하세요: ${newPassword}`,
        to: inputEmail,
        from: process.env.EMAIL
      });
      
      return "비밀번호 초기화 완료";
    }
    catch(error){
      throw new Error(error);
    }
  }

}

export { userAuthService };
