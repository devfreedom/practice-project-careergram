// from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import { Certificate } from "../db";


// import bcrypt from "bcrypt";
// import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

class CertificateService{
    // Create 자격증 생성
    static async addCertificate({ title, issuer, certDate }) {
        try {
          const certificate = await Certificate.findOneByTitle({ title });
      
          if (certificate) {
            const errorMessage = "등록된 자격증입니다. 다른 자격증을 입력하세요.";
            return { errorMessage };
          }
      
          const newCertificate = { title, issuer, certDate };
          const createdNewCertificate = await Certificate.create({newCertificate});
      
          return createdNewCertificate;
        } catch (error) {
          // 에러 처리
          console.error("자격증 추가 중 오류 발생:", error);
          throw error; // 오류를 상위 레벨로 던져 처리하도록 함
        }
      }
      
    static async delCertificate({title}){
        try{
            const delCertificate=await Certificate.deleteOne({title:title})
        }
        catch(err){
            console.log(err)
            next(err)
        }

        
    }
    static async getCertificate({id}){
        const certificate=await Certificate.findOneById({id:id})
        return certificate;
    }

}

export { CertificateService };
