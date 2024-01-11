import { Schema, model } from "mongoose";

const AwardSchema = new Schema(
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
      awardDate: {
        type: String,
        required: true,
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
const AwardModel= model("Award", AwardSchema);

export { AwardModel };
