import { EducationModel } from "../schemas/education";

// 학력정보 document를 다루는 CRUD 작업을 객체지향적 메소드로 정의합니다.
class Education {

  // [CRUD] CREATE
  // 전달받은 newEduData 데이터로 새로운 학력정보 document를 만들어 데이터베이스에 저장합니다.
  static async create(newEduData) {
    try {
      const result = await EducationModel.create(newEduData);
      return result;
    }
    catch(error) {
      throw new Error(error);
    }
  }

  // [CRUD] READ
  // 찾고자 하는 학력정보의 ObjectId를 eduId로 입력받아, 이와 일치하는 학력정보 document를 찾습니다.
  static async findEducationByEduId(eduId) {
    try {
      const result = await EducationModel.findOne({ _id: eduId });
      return result;
    }
    catch(error) {
      throw new Error(error);
    }
  }

  // [CRUD] READ
  // 찾고자 하는 사용자의 고유번호를 UserSchema에 정의된 id인 userId로 입력받아, 이와 일치하는 학력정보 document들을 모두 찾습니다.
  static async findEducationsByUserId(userId) {
    try {

      // [TO-DO] [IMPROVEMENT] offset pagination을 사용해서 서버사이드 pagination을 구현할수도 있습니다.

      const result = await EducationModel.find({ userId: userId });
      return result;
    }
    catch(error) {
      throw new Error(error);
    }
  }

  // [CRUD] UPDATE
  // ObjectId로 기존 학력정보 document를 찾아서, 입력받은 새로운 학력정보로 최신화하는 기능을 구현합니다.
  static async update(eduId, updatedEduData) {
    try {
      // 기존 학력정보 document를 찾을 때 사용할 ObjectId를 지정합니다.
      const filter = { _id: eduId };

      // 최신화가 필요한 필드와 그 필드에 넣어줄 새로운 데이터를 지정합니다.
      // updatedEduData에 속한 필드와 값을 한꺼번에 넣어주기 위해서 $set 연산자를 사용합니다.
      const update = { $set: updatedEduData };

      // findOneAndUpdate() 메소드에 사용할 옵션을 지정합니다.
      // 수정되지 않은 원래의 문서를 반환하는 것이 기본값으로 설정되어 있습니다.
      // 최신화된 정보를 반환해주기 위해서 기본값을 비활성화 하도록 하겠습니다.
      const option = { returnOriginal: false };

      // 위에서 지정한 변수들을 findOneAndUpdate() 메소드에 전달인자로 사용해서 학력정보 document를 최신화합니다.
      const result = await EducationModel.findOneAndUpdate(
        filter,
        update,
        option
      );
      return result;
    }
    catch(error) {
      throw new Error(error);
    }
  }

  // [CRUD] DELETE
  // ObjectId로 찾은 학력정보 document를 데이터베이스로부터 삭제하는 기능을 구현합니다.
  static async delete(eduId) {
    try{
      return EducationModel.findOneAndDelete({ _id: eduId });
    }
    catch(error) {
      throw new Error(error);
    }
  }

}

export { Education };