import { Project } from "../db/models/Project";

//implementing services that's actually going to be used in real service
//through application and expansion of CRUD methods of Project class, 
// Project 클래스에서 정의된 CRUD 메소드들을 활용 및 확장하여, 실제 서비스에서 사용되는 '기능'들을 구체적으로 구현합니다.


// [warning] project_userId is actually userId from project schema
// [주의점] project 스키마에 userId가 아래의 project_userId를 의미한다.

class ProjectService{


  // [CRUD] CREATE
  // service for users to add their own project
  // 사용자가 자신의 project을 추가하는 기능을 구현합니다.  
  static async addProject(newProjectData) {
      try {
        const addedProject = await Project.create(newProjectData);
        return addedProject;
        }
      catch(error) {
          throw new Error(error);
      }
    }
  // [CRUD] READ
  // service for users to view every project relate features
  // 사용자가 자신의 모든 프로젝트사항을 보는 기능을 구현합니다.
  static async getMyProjects(currentUserId) {
    try {
      const targetDocuments = await Project.findProjectsByUserId(currentUserId);
      
      // [보안] 업데이트를 요청한 사용자와 모든 프로젝트정보 document들의 소유자가 일치하는지를 검증합니다.
      targetDocuments.forEach(element => {
        if(currentUserId !== element.userId){
          throw new Error("현재 로그인한 사용자는 해당 정보를 열람할 권한이 없습니다.")
        }
      });
      
      // 검증이 통과되면 모든 document들을 반환합니다.
      return targetDocuments;
    }
    catch(error) {
      throw new Error(error);
    }
  }

  // [CRUD] READ
  // project document Id로 해당정보를 가져옴
  static async getthisprojectwithdoc(docid) {
    try {
      const userProjects = await Project.findProjectByProjectId(docid);
      return userProjects;
    }
    catch(error) {
      throw new Error(error);
    }
  }

  
// [CRUD] UPDATE
  // 사용자가 자신의 project사항을 수정하는 기능을 구현합니다.
  static async modifyMyProject(currentUserId, project_Id, newProjectData) {
    try {
      // 해당 project_Id로 document 검색을 시도합니다.
      const targetDocument = await Project.findProjectByProjectId(project_Id)
      
      // [TO-DO] [REFACTOR] express-validator를 활용해서 validation을 일관된 메커니즘으로 수행하도록 개선해야 합니다.

      // 만약 document가 없다면 오류를 생성합니다.
      if(!targetDocument){
        throw new Error("수정할 프로젝트정보를 찾을 수 없습니다.")
      }

      // [보안] 업데이트를 요청한 사용자와 프로젝트정보 document의 소유자가 일치하는지를 검증합니다.
      if(currentUserId !== targetDocument.userId){
        throw new Error("현재 로그인한 사용자는 해당 정보를 수정할 권한이 없습니다.")
      }

      // 검증이 통과되면 document를 최신화합니다.
      const modifiedProject = await Project.update(project_Id, newProjectData);
      return modifiedProject;
    }
    catch(error) {
      throw new Error(error);
    }
  }

   // [CRUD] DELETE
  // service that that deletes project of user 
  // 사용자가 자신의 프로젝트사항을 삭제하는 기능을 구현합니다.
  static async removeMyProject(currentUserId, project_Id) {
    try {
      // 해당 userId로 document 검색을 시도합니다.
      const targetDocument = await Project.findProjectByProjectId(project_Id)
      
      // [TO-DO] [REFACTOR] express-validator를 활용해서 validation을 일관된 메커니즘으로 수행하도록 개선해야 합니다.

      // 만약 document가 없다면 오류를 생성합니다.
      if(!targetDocument || targetDocument == null){
        throw new Error("삭제할 프로젝트정보를 찾을 수 없습니다.")
      }
      
      // [보안] 삭제를 요청한 사용자와 프로젝트정보 document의 소유자가 일치하는지를 검증합니다.
      if(currentUserId !== targetDocument.userId){
        throw new Error("현재 로그인한 사용자는 해당 정보를 수정할 권한이 없습니다.")
      }

      // 검증이 통과되면 document를 삭제합니다.
      const removedProject = await Project.delete(project_Id);
      return "해당 프로젝트 삭제 완료";
    }
    catch(error) {
      throw new Error(error);
    }
  }
}
export { ProjectService };