import { Router } from "express";

import { Education } from "../db/models/Education";
import { EducationService } from "../services/educationService";

import { login_required } from "../middlewares/login_required";
import { routeSanitizer } from "../middlewares/routeSanitizer";

const educationRouter = Router();

// [참고] 
// 프레젠터 레벨에서는 schema와 data type등 ODM 관점의 input validation을 수행합니다.
// 서비스 레벨에서는 프로덕트 정책과 관련된 비즈니스 로직 validation을 수행합니다. userService.js를 참조하세요.

// [완료] 라우팅 경로를 보다 RESTful하게 설정해야 합니다.


// [CRUD] CREATE
// 프론트엔드로부터 전달받은 학력사항 입력값을 사용자의 새로운 학력정보로 저장합니다.
educationRouter.post("/users/:userid/educations", routeSanitizer, login_required, async (req, res, next) => {
  try {
    const newEduData = req.body;
    const currentUserId = req.currentUserId;

    // [TO-DO] [REFACTOR] express-validator를 활용해서 validation을 일관된 메커니즘으로 수행하도록 개선해야 합니다.

    if(!newEduData || typeof newEduData !== 'object'){
      throw new Error("입력된 학력 정보가 없거나 올바르지 않습니다.")
    }

    if(!currentUserId){
      throw new Error("현재 로그인한 사용자를 알 수 없습니다.")
    }

    if(currentUserId !== req.params.userid){
      throw new Error("현재 로그인한 사용자가 보낸 요청이 아닙니다.")
    }
    
    // 검증이 통과되면 현재 로그인된 사용자의 ID를 새로운 필드인 "userId"의 값으로 만들어 newEduData 객체에 추가해줍니다.
    newEduData["userId"] = currentUserId;

    const createdNewEducation = await EducationService.addMyEducation(newEduData);
    
    if(createdNewEducation.error){
      throw new Error(createdNewEducation.error);
    }
    
    res.status(200).json(createdNewEducation);
    return;
  }
  catch(error) {
    next(error);
  }
});


// [CRUD] READ
// 프론트엔드로부터 전달받은 userId를 사용해서 해당 사용자의 학력정보를 모두 가져옵니다.
educationRouter.get("/users/:userid/educations", routeSanitizer, login_required, async (req, res, next) => {
  try {
    // 사용자 본인이 아닌 타인의 학력정보도 열람할 수 있는 상황이므로 req.currentUserId를 사용하지 않습니다.
    // const currentUserId = req.currentUserId;
    const userId = req.params["userid"];
    
    // 사용자 본인이 아니더라도 타인의 학력정보를 열람할 수 있는 상황이므로 getEducation 서비스를 사용하지 않습니다.
    // const foundUserEducations = await EducationService.getEducation(currentUserId, userId);
    const foundUserEducations = await EducationService.getUserEducations(userId);

    if (foundUserEducations.error) {
      throw new Error(foundUserEducations.error);
    }
    
    res.status(200).json(foundUserEducations);
    return;
  }
  catch(error) {
    next(error);
  }
});


// [CRUD] READ
// [보안] 이 요청은 로그인 여부와 권한과 상관없이 누구나 보낼 수 있습니다. 프론트엔드에서 사용시 주의하세요.
// 프론트엔드로부터 전달받은 eduId를 사용해서 단일 학력정보 항목을 찾아 가져옵니다.
educationRouter.get("/educations/:documentid", routeSanitizer, login_required, async (req, res, next) => {
  try {
    // 사용자 본인이 아닌 타인의 학력정보도 열람할 수 있는 상황이므로 req.currentUserId를 사용하지 않습니다.
    // const currentUserId = req.currentUserId;
    const eduId = req.params["documentid"];

    // 사용자 본인이 아니더라도 타인의 학력정보를 열람할 수 있는 상황이므로 getEducation 서비스를 사용하지 않습니다.
    // const foundUserEducations = await EducationService.getEducation(currentUserId, userId);
    const foundEducation = await Education.findEducationByEduId(eduId);
  
    if (foundEducation.error) {
      throw new Error(foundEducation.error);
    }

    res.status(200).json(foundEducation);
    return;
  }
  catch(error) {
    next(error);
  }
});


// [CRUD] UPDATE
// 프론트엔드로부터 전달받은 최신 학력사항 입력값으로 기존 학력정보를 업데이트합니다.
educationRouter.put("/educations/:documentid", routeSanitizer, login_required, async (req, res, next) => {
  try {
    const currentUserId = req.currentUserId;
    const eduId = req.params["documentid"];
    const updatedEduData = req.body;

    // [TO-DO] [REFACTOR] express-validator를 활용해서 validation을 일관된 메커니즘으로 수행하도록 개선해야 합니다.
    
    if(!updatedEduData || typeof updatedEduData !== 'object'){
      throw new Error("입력된 학력 정보가 없거나 올바르지 않습니다.")
    }

    if(!eduId){
      throw new Error("사용자의 학력 정보를 특정할 수 없습니다.")
    }

    if(!currentUserId){
      throw new Error("현재 로그인한 사용자를 알 수 없습니다.")
    }

    const updatedEducation = await EducationService.modifyMyEducation(currentUserId, eduId, updatedEduData);

    if (updatedEducation.error) {
      throw new Error(updatedEducation.error);
    }

    res.status(200).json(updatedEducation);
    return;
  }
  catch(error) {
    next(error);
  }
});


// [CRUD] DELETE
// 프론트엔드로부터 전달받은 eduId를 사용해서 학력정보를 찾아 삭제합니다.
educationRouter.delete("/educations/:documentid", routeSanitizer, login_required, async (req, res, next) => {
  try {
    const currentUserId = req.currentUserId;
    const eduId = req.params["documentid"];

    const deletedEducation = await EducationService.removeMyEducation(currentUserId, eduId);

    if (deletedEducation.error) {
      throw new Error(deletedEducation.error);
    }

    res.status(200).send("삭제가 완료되었습니다.");
    return;
  }
  catch(error) {
    next(error);
  }
});
 
export { educationRouter };
