import { Schema, model } from "mongoose";
const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

// 게시판 document들이 저장되는 'textboards' collection의 스키마를 정의합니다.
const TextboardSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      // username은 현재 로그인한 사용자의 id를 기반으로 백엔드에서 별도로 찾아서 추가하므로 프론트엔드에서 입력받지 않습니다.
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// mongoose-sequence 플러그인이 게시글 번호를 의미하는 postIndex 필드를 자체적으로 생성해서 auto-increment를 수행합니다.
TextboardSchema.plugin(AutoIncrement, { inc_field: 'postIndex' });

const TextboardModel = model("Textboard", TextboardSchema);

// [DONE] [IMPROVEMENT] COLLSCAN 쿼리 전략 대신에 IXSCAN 쿼리 젼략을 사용할 수 있도록 필드에 indexing 처리를 해주면 성능이 크게 향상됩니다.
//                      참고로 mongoose.explain(executionStats) 메서드를 사용해서 쿼리 결과값이 아닌 쿼리 '수행' 과정에 대한 정보를 얻을 수 있습니다.

// 카테고리별로 게시글을 가져오는 작업에 IXSCAN 쿼리 전략을 사용하기 위해 indexing을 선언해줍니다.
// 내림차순을 위해서 "1" 값을, 중복되지 않는 고유값을 부여하기 위해 unique 옵션을 사용합니다.
TextboardModel.createIndex({ "category": 1 }, { "unique": true });

export { TextboardModel };