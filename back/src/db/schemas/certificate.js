import { Schema, model } from "mongoose";

const CertificateSchema = new Schema(
  {
    userId:{
        type:String,
        required:true
    },
    title: {
        type: String,
        required: true,
      },
      issuer: {
        type: String,
        required: true,
      },
      certDate: {
        type: String,
        required: true,
      },
      expDate: {
        type: String,
      },
      description: {
        type: String,
        default: "설명이 아직 없습니다. 추가해 주세요.",
      },
      imgBase64:{
        type: String,
        required: false,
      },
  
},  {
  timestamps: true,
}
)
const CertificateModel= model("Certificate", CertificateSchema);

export { CertificateModel };
