import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "설명이 아직 없습니다. 추가해 주세요.",
    },
    social: {
      type: Object,
      required: false,
    },
    imgUrl: {
      type: String,
      required: false,
    },
    imgBase64:{
      type: String,
      required: false,
    },
    isPasswordReset: {
      type: Boolean,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", UserSchema);

// [DONE] [IMPROVEMENT] COLLSCAN 쿼리 전략 대신에 IXSCAN 쿼리 젼략을 사용할 수 있도록 필드에 indexing 처리를 해주면 성능이 크게 향상됩니다.
//                      참고로 mongoose.explain(executionStats) 메서드를 사용해서 쿼리 결과값이 아닌 쿼리 '수행' 과정에 대한 정보를 얻을 수 있습니다.

// userId 기반으로 사용자를 가져오는 작업에 IXSCAN 쿼리 전략을 사용하기 위해 indexing을 선언해줍니다.
// 내림차순을 위해서 "1" 값을, 중복되지 않는 고유값을 부여하기 위해 unique 옵션을 사용합니다.
UserModel.createIndex({ "userId": 1 }, { "unique": true });

export { UserModel };
