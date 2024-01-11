import { Router } from "express";

import { Project } from "../db/models/Project";
import { ProjectService } from "../services/projectService";

import { login_required } from "../middlewares/login_required";

const projectRouter = Router();
// having setup ready for http methods
// http methods 준비

// [참고] 
// 프레젠터 레벨에서는 schema와 data type등 ODM 관점의 input validation을 수행합니다.
// 서비스 레벨에서는 프로덕트 정책과 관련된 비즈니스 로직 validation을 수행합니다. userService.js를 참조하세요.

//commit ho push ham 2

// [CRUD] CREATE
// 프론트엔드로부터 전달받은 project사항 입력값을 사용자의 새로운 project정보로 저장합니다.
projectRouter.post("/users/:userid/projects", login_required, async (req, res, next) => {   
try{
    const newProjectData=req.body;
    const currentUserId=req.currentUserId;
    //const currentUserId=req.headers.currentuserid;

     // [TO-DO] [REFACTOR] express-validator를 활용해서 validation을 일관된 메커니즘으로 수행하도록 개선해야 합니다.

     if(!newProjectData || typeof newProjectData !== 'object'){
        throw new Error("입력된 프로젝트 정보가 없거나 올바르지 않습니다.")
      }
  
      if(!currentUserId || currentUserId == null){
        throw new Error("현재 로그인한 사용자를 알 수 없습니다.")
      }
  
      if(currentUserId !== req.params.userid){
        throw new Error("현재 로그인한 사용자가 보낸 요청이 아닙니다.")
      }
      
      // 검증이 통과되면 현재 로그인된 사용자의 ID를 새로운 필드인 "userId"의 값으로 만들어 newEduData 객체에 추가해줍니다.
      newProjectData["userId"] = req.params.userid;// originally it's currentUserId;
      
      const createdNewProject = ProjectService.addProject(newProjectData);
      
      if(createdNewProject.error){
        throw new Error(createdNewProject.error);
      }
      
      res.status(200).json(createdNewProject);
      return;
}
catch(error) {
    next(error);
  }
});

// [CRUD] READ
// 프론트엔드로부터 전달받은 userId를 사용해서 해당 사용자의 project정보를 모두 가져옵니다.
projectRouter.get("/users/:userid/projects", login_required, async (req, res, next) => {
    try {
      
      const userId = req.params.userid;
      
      // 사용자 본인일때 열람가능, ProjectService.getMyprojects에서 검증
      const foundUserProjects = await ProjectService.getMyProjects(userId);
  
      if (foundUserProjects.error) {
        throw new Error(foundUserProjects.error);
      }
      
      res.status(200).json(foundUserProjects);
      return;
    }
    catch(error) {
      next(error);
    };
});

// [CRUD] READ
// 프론트엔드로부터 전달받은 project_userId를 사용해서 단일 project정보 항목을 찾아 가져옵니다.
projectRouter.get("/projects/:docid", login_required, async (req, res, next) => {
    try {
      // 사용자 본인이 아닌 타인의 프로젝트정보도 열람할 수 있는 상황이므로 req.currentUserId를 사용하지 않습니다.
        const project_Id = req.params.docid;
  
      // 사용자 본인이 아니더라도 타인의 프로젝트정보를 열람할 수 있는 상황
      const foundProject = await ProjectService.getthisprojectwithdoc(project_Id);
    
      if (foundProject.error) {
        throw new Error(foundProject.error);
      }
  
      res.status(200).json(foundProject);
      return;
    }
    catch(error) {
      next(error);
    }


});


projectRouter.put("/projects/:docid",login_required,async(req,res,next)=>{
    try{
        const project_Id=req.params.docid;
        const newprojectdata=req.body;
        const currentUserId=req.currentUserId;
        //const currentUserId=req.headers.currentuserid;
        
        if(!newprojectdata || typeof newprojectdata!== 'object'){
            throw new Error("입력된 프로젝트 정보가 없거나 올바르지 않습니다");
        }

        if(!project_Id){
            throw new Error("사용자의 프로젝트 정보를 특정할 수 없습니다.");
        }

        if(!currentUserId){
            throw new Error("현재 로그인한 사용자를 알 수 없습니다.");
        }

        const updatedProject =await ProjectService.modifyMyProject(currentUserId,project_Id,newprojectdata);
    
        if(updatedProject.error){
            throw new Error(updatedProject.error);
        }

        res.status(200).json(updatedProject);
        return;
    }
    catch(error){
        next(error);
    }
});



projectRouter.delete("/projects/:docid",login_required,async(req,res,next)=>{
    try{
        const projectId=req.params.docid;
        const currentUserId=req.currentUserId;
       // const currentUserId=req.headers.currentuserid;
       

        const deletedProject=await ProjectService.removeMyProject(currentUserId,projectId);

        if(deletedProject.error){
            throw new Error(deletedProject.error);
        }

        res.status(200).send("삭제가 완료되었습니다.");
        return;
    }
    catch(error){
        next(error);
    }
});


  




export { projectRouter }





// routers below are made from Project class directively

/*

// CRUD: CREATE
//insert new project document with input from frontent
//프론트엔드에서 입력받은 정보로 새러운 project document 생성
projectRouter.post("/:user_id/project",/*login_required,async(req,res)=>{
    const newProjectData=req.body;
    newProjectData["userId"]=req.params.user_id;
    
    try{
        const newProject= await Project.create(newProjectData); <-this one might be error
        console.log(newProject);
        res.status(200).json(newProjectData);
        // HTTP status code 200 is known as "OK". 
        //It indicates that the request has been successfully processed
    } catch (error){
        console.error(error);
        res.status(500).json(newProjectData);
        //The HTTP status code 500 indicates a server error.
        
    }

    return;
});



//CRUD:READ
//read project document that corresponds to project_title in request from frontend
//frontend에서 받은 project_title에 해당하는 project document를 읽는다
projectRouter.get("/project/:project_title", /*login_required, async(req, res)=>{  

    const projecttitle = req.params.project_title;
    try{
    const project_document = await Project.findProjectByTitle(projecttitle);
    res.status(200).json(project_document);    
    } catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
    
    return;
});


//CRUD:READ
//read project document that corresponds to userId in request from frontend
//frontend에서 받은 userId에 해당하는 project document를 읽는다
projectRouter.get("/:user_id/project",/* login_required, async(req, res)=>{
    const userId=req.params.user_id;
    try{
    const project_document=await Project.findProjectByUserId({user_Id:userId});
    res.status(200).json(project_document);
    } catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }

    return;
});

// CRUD: UPDATE
//insert project document that corresponds to userId in request from frontend
//frontend에서 받은 userId에 해당하는 project document를 갱신한다
projectRouter.put("/project/:project_title", /*login_required, async(req, res)=>{  

    const updatedProjectData = req.body;
    const projecttitle = req.params.project_title;
    try{
    const updatedProject = await Project.update({project_title:projecttitle},{updateobject:updatedProjectData});
    res.status(200).json(updatedProject);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }

    return;
   

});

// CRUD: DELETE
// delete the document of corresponding title
// 프론트엔드로 전달받은 project_title을 통해 해당 document 삭제
projectRouter.delete("/project/:project_title", async(req, res)=>{  

    const projecttitle = req.params.project_title;
    try{
    const deletedProject = await Project.delete({ project_title:projecttitle });
    res.status(200).json(deletedProject);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }

    return;
   
});
*/