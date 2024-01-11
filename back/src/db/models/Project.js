import { ProjectModel } from "../schemas/project";



class Project {

  //CRUD:create
  //create and return new project document in database
  //새로운 project 정보를 추가하고 반환한다.
    static async create( newProject ) {
        try{
        const createdNewProject = await ProjectModel.create(newProject);
        return createdNewProject;
         }
         catch(error){
            throw new Error(error);
        }
    }
 
  //CRUD:READ
  //find and return new document of corresponding userId from schema
  //project schema userId을 이용해서 상응하는 document를 찾고 반환한다.
  static async findProjectByUserId( user_Id ) {
    try{
    const project_document = await ProjectModel.findOne({userId:user_Id}); // this one gonna look for p_o in the field of organization
    return project_document;
    }
    catch(error){
        throw new Error(error);
    }
  }  

  // CRUD: READ
  // find all corresponding Project doucments using userId from schema
  // document의 project schema userId로 해당하는 모든 project_document들를 찾아주는 기능을 구현합니다.
  static async findProjectsByUserId(user_Id){
    try{
    const project_documents= await ProjectModel.find({userId:user_Id});
    return project_documents;
    }
    catch(error){
    throw new Error(error);
    }
  }
  
 //CRUD:READ
  //find and return new document of corresponding ProjectId(objectId)
  //ProjectId(ObjectId)을 이용해서 상응하는 document를 찾고 반환한다.
  static async findProjectByProjectId( Project_Id) {
    try{
    const project_document = await ProjectModel.findOne({_id:Project_Id}); // this one gonna look for p_o in the field of organization
    return project_document;
    }
    catch(error){
        throw new Error(error);
    }
  }  

 
  
  //CRUD:UPDATE  
  //find document you want to update with userId
  //and update it with new data inserted from frontend
  //userId을 이용해 원하는 document를 찾고
  //frontend로부터 입력받은 새로운 데이터로 갱신한다.
    static async update( project_Id, updateobject ) {
      try{  
      const filter = { _id: project_Id };
      const update = {$set:updateobject};//이것자체가 object
      const option = { returnOriginal: false };
  //returnOriginal option to false, 
  //the method will return the updated document 
  //after the modification is applied
      const updatedProject = await ProjectModel.findOneAndUpdate(
        filter,
        update,
        option
      );
      return updatedProject;
      }
      catch(error){
        throw new Error(error);
      }
    }

// CRUD: DELETE
  // delete project document of corresponding title
  // Project 정보를 삭제하는 기능을 구현합니다.
  static async delete( project_Id) {
    try{
    return ProjectModel.findOneAndDelete({ _id:project_Id});
  }
  catch(error){
    throw new Error(error);
  }

  }

}


export { Project };




 /*
  //CRUD:READ
  //find and return new document that has corresponding project_title
  //project_title을 이용해서 상응하는 document를 찾고 반환한다.
    static async findProjectByTitle( project_title ) {
      const project_document = await ProjectModel.findOne({ title: project_title });//this one looks for title everywhere
      return project_document;
    }
  //CRUD:READ
  //find and return new document of corresponding project_organization
  //project_organization을 이용해서 상응하는 document를 찾고 반환한다.
    static async findProjectByOrgnaization( project_organization ) {
      const project_document = await ProjectModel.findOne({ organization: project_organization }); // this one gonna look for p_o in the field of organization
      return project_document;
    }
*/