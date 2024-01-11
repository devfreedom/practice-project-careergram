import { Schema, model } from "mongoose";

// 학력정보 document들이 저장되는 'educations' collection의 스키마를 정의합니다.
const EducationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
    },
    major: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    // regex를 기반으로 YYYY-MM-DD 형식을 규정합니다.
    entryDate: {
      type: String,
      match: /^\d{4}-\d{2}-\d{2}$/,
      required: true,
    },
    gradDate: {  
      type: String,
      match: /^\d{4}-\d{2}-\d{2}$/,
      required: false,
    },
    grade: {
      type: String,
    },
    description: {
      type: String,
      required: false,
    },
    sortOrder:{
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const EducationModel = model("Education", EducationSchema);

export { EducationModel };
