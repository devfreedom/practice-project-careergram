import { Textboard } from "../db/models/Textboard";
import { TextboardModel } from "../db/schemas/textboard";

// Textboard 클래스에서 정의된 CRUD 메소드들을 활용 및 확장하여, 실제 서비스에서 사용되는 '기능'들을 구체적으로 구현합니다.
class TextboardService {

  // [CRUD] CREATE
  // 사용자가 게시글을 추가하는 기능을 구현합니다.
  static async addMyPost(currentUserId, newPost) {
    try {
      // 현재 로그인한 사용자의 이름을 데이터베이스에서 가져와서 document에 username 필드로 추가해줍니다.
      const targetDocument = await TextboardModel.find({ id: currentUserId });
      const username = targetDocument["name"];
      newPost["username"] = username;

      const addedPost = await Textboard.create(newPost);
      return addedPost;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  // [CRUD] UPDATE
  // 사용자가 자신의 게시글을 수정하는 기능을 구현합니다.
  static async modifyMyPost(currentUserId, postId, updatePost) {
    try {
      // 해당 postId로 document 검색을 시도합니다.
      const targetDocument = await Textboard.findPostByPostId({ _id: postId })

      // [TO-DO] [REFACTOR] express-validator를 활용해서 validation을 일관된 메커니즘으로 수행하도록 개선해야 합니다.

      // 만약 document가 없다면 오류를 생성합니다.
      if (!targetDocument) {
        throw new Error("수정할 게시글을 찾을 수 없습니다.")
      }

      // [보안] 업데이트를 요청한 사용자와 게시글 document의 소유자가 일치하는지를 validation합니다.
      if (currentUserId !== targetDocument["userId"]) {
        throw new Error("현재 로그인한 사용자는 해당 게시글을 수정할 권한이 없습니다.")
      }

      // validation이 통과되면 document를 최신화합니다.
      const modifiedPost = await Textboard.update(postId, updatePost);
      return modifiedPost;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  // [CRUD] DELETE
  // 사용자가 자신의 게시글을 삭제하는 기능을 구현합니다.
  static async removeMyPost(currentUserId, postId) {
    try {
      // 해당 postId로 document 검색을 시도합니다.
      const targetDocument = await Textboard.findPostByPostId(postId)

      // [TO-DO] [REFACTOR] express-validator를 활용해서 validation을 일관된 메커니즘으로 수행하도록 개선해야 합니다.

      // 만약 document가 없다면 오류를 생성합니다.
      if (!targetDocument) {
        throw new Error("삭제할 게시글을 찾을 수 없습니다.")
      }

      // [보안] 삭제를 요청한 사용자와 게시글 document의 소유자가 일치하는지를 validate 합니다.
      if (currentUserId !== targetDocument["userId"]) {
        throw new Error("현재 로그인한 사용자는 해당 게시글을 삭제할 권한이 없습니다.")
      }

      // validation이 통과되면 document를 삭제합니다.
      const removedPost = await Textboard.delete(postId);
      return "게시글 삭제 완료";
    }
    catch (error) {
      throw new Error(error);
    }
  }

}

export { TextboardService };
