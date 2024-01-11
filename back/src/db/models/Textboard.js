import { TextboardModel } from "../schemas/textboard";

// 게시판 document를 다루는 CRUD 작업을 객체지향적 메소드로 정의합니다.
class Textboard {

  // [CRUD] CREATE
  // 전달받은 newText 데이터로 새로운 게시글 document를 만들어 데이터베이스에 저장합니다.
  static async create(newPost) {
    try {
      const result = await TextboardModel.create(newPost);
      return result;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  // [CRUD] READ
  // 사용자의 id를 userId로 입력받아, 해당 사용자가 작성한 게시글 document들을 모두 찾습니다.
  // server-side offset pagination이 반영되어 있습니다.
  static async findPostsByUserId(userId, page, limit) {
    try {
      // 전체 document 수를 파악합니다.
      const totalCount = await TextboardModel.find({ userId: userId }).count();

      // 지정된 조건으로 document들을 일정 단위로 끊어서 가져옵니다.
      const result = await TextboardModel.find({ userId: userId })
        .sort({ index: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const paginatedResult = {
        result,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page
      }

      return paginatedResult;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  // [CRUD] READ
  // 찾고자 하는 게시글의 _id를 postId로 받아, 이와 일치하는 게시글 document를 찾습니다.
  static async findPostByPostId(postId) {
    try {
      const result = await TextboardModel.findOne({ _id: postId });
      return result;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  // [CRUD] READ
  // 게시판의 모든 게시글 document들을 가져옵니다.
  // server-side offset pagination이 반영되어 있습니다.
  static async findPostsAll(page, limit) {
    try {
      // 전체 document 수를 파악합니다.
      const totalCount = await TextboardModel.find({}).count();

      // 지정된 조건으로 document들을 일정 단위로 끊어서 가져옵니다.
      const result = await TextboardModel.find({})
        .sort({ index: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const paginatedResult = {
        result,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page
      }

      return paginatedResult;
    }
    catch (error) {
      throw new Error(error);
    }
  }


  // [CRUD] READ
  // 게시판의 특정 카테고리에 해당하는 게시글 document들을 가져옵니다.
  // server-side offset pagination이 반영되어 있습니다.
  static async findPostsByCategory(category, page, limit) {
    try {
      // 전체 document 수를 파악합니다.
      const totalCount = await TextboardModel.find({ category: category }).count();

      // 지정된 조건으로 document들을 일정 단위로 끊어서 가져옵니다.
      const result = await TextboardModel.find({ category: category })
        .sort({ index: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const paginatedResult = {
        result,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page
      }

      return paginatedResult;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  // [CRUD] UPDATE
  // 게시글의 _id를 postId로 받아 기존 게시글 document를 찾아서, 입력받은 새로운 게시글로 최신화하는 기능을 구현합니다.
  static async update(postId, updatedText) {
    try {
      // 기존 게시글 document를 찾을 때 사용할 ObjectId를 지정합니다.
      const filter = { _id: postId };

      // 최신화가 필요한 필드와 그 필드에 넣어줄 새로운 데이터를 지정합니다.
      // updatedText에 속한 필드와 값을 한꺼번에 넣어주기 위해서 $set 연산자를 사용합니다.
      const update = { $set: updatedText };

      // findOneAndUpdate() 메소드에 사용할 옵션을 지정합니다.
      // 수정되지 않은 원래의 문서를 반환하는 것이 기본값으로 설정되어 있습니다.
      // 최신화된 정보를 반환해주기 위해서 기본값을 비활성화 하도록 하겠습니다.
      const option = { returnOriginal: false };

      // 위에서 지정한 변수들을 findOneAndUpdate() 메소드에 전달인자로 사용해서 게시글 document를 최신화합니다.
      const result = await TextboardModel.findOneAndUpdate(
        filter,
        update,
        option
      );
      return result;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  // [CRUD] DELETE
  // 게시글의 _id를 postId로 받아 게시글 document를 찾은 다음 데이터베이스로부터 삭제합니다.
  static async delete(postId) {
    try {
      return TextboardModel.findOneAndDelete({ _id: postId });
    }
    catch (error) {
      throw new Error(error);
    }
  }

}

export { Textboard };