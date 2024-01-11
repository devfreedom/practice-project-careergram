import { CertificateModel } from "../schemas/certificate.js";
class Certification {

  // Create
  // certDocId 사용하지 않음
  static async create({userId,title,issuer,certDate,expDate,certId,description}) {
    const createdNewCert = await CertificateModel.create({
      userId,
      title,
      issuer,
      certDate,expDate,certId,description
    });
    return createdNewCert;
  }
  // Read
  static async findById({userId}) {
    
    const filter = { userId: userId};
    const certificates = await CertificateModel.find(filter);
    return certificates;
  }

  // Update
  static async updateOne({certDocId},newValue) {
    const filter = { _id: certDocId};
    // _id에 certDocId를 받아옴
    const update = { $set: newValue } ;
    const option = { returnOriginal: false,new:true};
    // 업데이트 되기 이전의 문서는 반환하지 않음
  
    const updatedCert = await CertificateModel.findOneAndUpdate(
      filter,
      update,
      option,

    );
    return updatedCert;
  }

  //Delete
  static async deleteOne({certDocId}) { 
    const filter = { _id: certDocId};
    const deletedCert=await CertificateModel.findOneAndDelete(filter)
    return deletedCert;
  }

}

export { Certification };
