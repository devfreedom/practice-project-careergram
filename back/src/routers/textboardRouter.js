import { Router } from "express";

import { Textboard } from "../db/models/Textboard";
import { TextboardService } from "../services/textboardService";

import { login_required } from "../middlewares/login_required";
import { routeSanitizer } from "../middlewares/routeSanitizer";

const textboardRouter = Router();

// [참고] 
// 프레젠터 레벨에서는 schema와 data type등 ODM 관점의 input validation을 수행합니다.
// 서비스 레벨에서는 프로덕트 정책과 관련된 비즈니스 로직 validation을 수행합니다. userService.js를 참조하세요.

// [CRUD] CREATE
// 로그인한 사용자로부터 전달받은 입력값을 게시판에 새로운 게시글로 저장합니다.
textboardRouter.post("/users/:userid/posts", routeSanitizer, login_required, async (req, res, next) => {
  try {
    const newPost = req.body;
    const currentUserId = req.currentUserId;

    // [TO-DO] [REFACTOR] express-validator를 활용해서 validation을 일관된 메커니즘으로 수행하도록 개선해야 합니다.

    if (!newPost || typeof newPost !== 'object') {
      throw new Error("입력된 내용이 없거나 올바르지 않습니다.")
    }

    if (!currentUserId) {
      throw new Error("현재 로그인한 사용자를 알 수 없습니다.")
    }

    if (currentUserId !== req.params.userid) {
      throw new Error("현재 로그인한 사용자가 보낸 요청이 아닙니다.")
    }

    // 검증이 통과되면 현재 로그인된 사용자의 ID를 새로운 필드인 "userId"의 값으로 만들어 newPost 객체에 추가해줍니다.
    newPost["userId"] = currentUserId;

    const createdNewPost = await TextboardService.addMyPost(currentUserId, newPost);

    if (createdNewPost.error) {
      throw new Error(createdNewPost.error);
    }

    res.status(200).json(createdNewPost);
    return;
  }
  catch (error) {
    next(error);
  }
});


// [CRUD] READ
// 프론트엔드로부터 전달받은 userId를 사용해서 해당 사용자의 게시글을 모두 가져옵니다.
textboardRouter.get("/users/:userid/posts", routeSanitizer, async (req, res, next) => {
  try {
    // 사용자 본인이 아닌 타인의 게시글도 열람할 수 있는 상황이므로 req.currentUserId를 사용하지 않습니다.
    // const currentUserId = req.currentUserId;
    const userId = req.params["userid"];

    // server-side offset pagination을 위한 page와 limit의 초기값을 지정해주고, 쿼리 입력값을 반영해줍니다.
    const { page = 1, limit = 10 } = req.query;

    const foundUserPosts = await Textboard.findPostsByUserId(userId, page, limit);

    if (foundUserPosts.error) {
      throw new Error(foundUserPosts.error);
    }

    res.status(200).json(foundUserPosts);
    return;
  }
  catch (error) {
    next(error);
  }
});


// [CRUD] READ
// 프론트엔드로부터 전달받은 postId를 사용해서 단일 게시글을 찾아 가져옵니다.
textboardRouter.get("/textboard/:documentid", routeSanitizer, async (req, res, next) => {
  try {
    // 사용자 본인이 아닌 타인의 게시글도 열람할 수 있는 상황이므로 req.currentUserId를 사용하지 않습니다.
    // const currentUserId = req.currentUserId;
    const postId = req.params["documentid"];

    const foundPost = await Textboard.findPostByPostId(postId);

    if (foundPost.error) {
      throw new Error(foundPost.error);
    }

    res.status(200).json(foundPost);
    return;
  }
  catch (error) {
    next(error);
  }
});


// [CRUD] READ
// 프론트엔드로부터 전달받은 category를 사용해서 특정 카테고리의 게시글들을 찾아 가져옵니다.
textboardRouter.get("/textboard/categories/:category", routeSanitizer, async (req, res, next) => {
  try {
    const category = req.params["category"];
    
    // server-side offset pagination을 위한 page와 limit의 초기값을 지정해주고, 쿼리 입력값을 반영해줍니다.
    const { page = 1, limit = 10 } = req.query;

    const foundCategoryPosts = await Textboard.findPostsByCategory(category, page, limit);

    if (foundCategoryPosts.error) {
      throw new Error(foundCategoryPosts.error);
    }

    res.status(200).json(foundCategoryPosts);
    return;
  }
  catch (error) {
    next(error);
  }
});


// [CRUD] READ
// 게시판의 모든 글을 가져옵니다.
textboardRouter.get("/textboard", routeSanitizer, async (req, res, next) => {
  try {
    // server-side offset pagination을 위한 page와 limit의 초기값을 지정해주고, 쿼리 입력값을 반영해줍니다.
    const { page = 1, limit = 10 } = req.query;

    const foundPosts = await Textboard.findPostsAll(page, limit);

    if (foundPosts.error) {
      throw new Error(foundPosts.error);
    }

    res.status(200).json(foundPosts);
    return;
  }
  catch (error) {
    next(error);
  }
});


// [CRUD] UPDATE
// 로그인한 사용자로부터 전달받은 입력값으로 기존 게시글을 업데이트합니다.
textboardRouter.put("/textboard/:documentid", routeSanitizer, login_required, async (req, res, next) => {
  try {
    const currentUserId = req.currentUserId;
    const postId = req.params["documentid"];
    const updatePost = req.body;

    // [TO-DO] [REFACTOR] express-validator를 활용해서 validation을 일관된 메커니즘으로 수행하도록 개선해야 합니다.

    if (!updatePost || typeof updatePost !== 'object') {
      throw new Error("입력된 내용이 없거나 올바르지 않습니다.")
    }

    if (!postId) {
      throw new Error("요청한 정보로는 게시글을 찾을 수 없습니다.")
    }

    if (!currentUserId) {
      throw new Error("현재 로그인한 사용자를 알 수 없습니다.")
    }

    const updatedPost = await TextboardService.modifyMyPost(currentUserId, postId, updatePost);

    if (updatedPost.error) {
      throw new Error(updatedPost.error);
    }

    res.status(200).json(updatedPost);
    return;
  }
  catch (error) {
    next(error);
  }
});


// [CRUD] DELETE
// 로그인한 사용자로부터 전달받은 postId를 사용해서 게시글을 찾아 삭제합니다.
textboardRouter.delete("/textboard/:documentid", routeSanitizer, login_required, async (req, res, next) => {
  try {
    const currentUserId = req.currentUserId;
    const postId = req.params["documentid"];

    const deletedPost = await TextboardService.removeMyPost(currentUserId, postId);

    if (deletedPost.error) {
      throw new Error(deletedPost.error);
    }

    res.status(200).send("삭제가 완료되었습니다.");
    return;
  }
  catch (error) {
    next(error);
  }
});

export { textboardRouter };
