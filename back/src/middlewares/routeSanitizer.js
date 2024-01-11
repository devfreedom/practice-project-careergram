import { body, param, validationResult } from "express-validator";

// [보안] req.body와 req.param의 모든 요소들을 sanitize 하는 미들웨어를 express-validator를 사용해 만들어 라우터에 적용합니다.
// [완료: REFACTOR] middlewares에다가 별도의 미들웨어로 분리해서 공용으로 사용해야 합니다.

exports.routeSanitizer = [
  body('**').escape(),
  param('**').escape(),
]
