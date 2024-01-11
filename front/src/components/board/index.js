//카테고리를 input으로 받아서 state에 담아서 변경될때마다 새로운 렌더링
//Category에 현재 카테고리 전달. 보여줄것: username, title, createdTime, modifiedTime, category text

import { useContext, useEffect, useMemo, useState } from "react";
import ListBlock from "./common/ListBlock";
import Category from "./Category";
import { styled } from "styled-components";
import { UserStateContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { hoverColor, mainColor } from "../common/color";
import PostEditer from "./Editer";
import {
  boardByALL,
  boardByCategory,
  boardDelete,
  boardUserGet,
} from "../../services/board";
import Loading from "../common/Loading";
import NoneData from "../common/NoneData";

const Board = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [category, setCategory] = useState("ALL");
  const [posts, setPosts] = useState([]);
  const [isModal, setIsModal] = useState(false);

  const navigate = useNavigate();
  const userState = useContext(UserStateContext);

  const categoryList = useMemo(() => {
    const categoryList = [
      "ALL",
      "이직/취업",
      "커리어 꿀팁",
      "자유",
      "내 게시글 보기",
    ];
    return categoryList;
  }, []);

  const koToEn = (ko) => {
    switch (ko) {
      case "이직/취업":
        return "industry";
      case "커리어 꿀팁":
        return "tips";
      case "자유":
        return "free";
      default:
        return ko;
    }
  };

  useEffect(() => {
    if (!userState.user) {
      navigator("/login", { replace: true });
      return;
    }

    const fetchfunction = async () => {
      // 전체 데이터를 불러옴, category state 바뀔때마다 새로 불러옴, mine일 경우 id로불러옴 Userstate필요
      if (category === "ALL") {
        const res = await boardByALL();
        setPosts(res?.data?.result);
        setIsFetching(true);
      } else if (category === "내 게시글 보기") {
        const res = await boardUserGet(userState.user.id);
        setPosts(res.data.result);
        setIsFetching(true);
      } else {
        const res = await boardByCategory(koToEn(category));
        setPosts(res.data.result);
        setIsFetching(true);
      }
    };
    fetchfunction();
  }, [category, categoryList, userState, navigate, isModal]);

  if (!isFetching) {
    return <Loading />;
  }

  return (
    <ListBlock>
      {isModal ? (
        <PostEditer
          categoryList={categoryList}
          setIsModal={setIsModal}
          setPosts={setPosts}
          userId={userState.user.id}
          state="글쓰기"
        />
      ) : (
        <WriteBlock onClick={() => setIsModal(true)}>Write</WriteBlock>
      )}
      <Category
        category={category}
        setCategory={setCategory}
        categoryList={categoryList}
      />
      {posts.length > 0 ? (
        <Block>
          {posts.map((post) => (
            <PostItem
              key={post._id}
              userId={userState.user.id}
              post={post}
              setPosts={setPosts}
            />
          ))}
        </Block>
      ) : (
        <div style={{ display: "flex", height: "1000px", marginTop: "30px" }}>
          <NoneData />
        </div>
      )}
    </ListBlock>
  );
};

export default Board;

const PostItem = ({ post, setPosts, userId }) => {
  const [isModal, setIsModal] = useState(false);
  const ISOdate = new Date(post.createdAt);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  async function handleDelete() {
    alert("진짜 삭제하실건가요?");
    try {
      await boardDelete(post._id);
      setPosts((datas) => {
        const deleteddatas = datas.filter((origin) => origin._id !== post._id);
        return deleteddatas;
      });
    } catch (err) {
      alert("프론트 데이터 삭제 실패");
    }
  }
  const formattedDate = ISOdate.toLocaleDateString("ko-KR", options)
    .replace(/\./g, " -")
    .slice(0, 14);

  return (
    <StyledBlock>
      {userId === post.userId ? (
        <div className="board-btn">
          <button onClick={() => setIsModal(true)}>수정</button>
          <button className="del" onClick={handleDelete}>
            삭제
          </button>
        </div>
      ) : null}
      {isModal && (
        <PostEditer
          post={post}
          setPosts={setPosts}
          setIsModal={setIsModal}
          documentId={post._id}
          state="수정"
        />
      )}
      <h1>{post.title}</h1>
      <div>
        <span>{post.username}</span>
        <span>{formattedDate}</span>
      </div>
      <p>{post.text}</p>
      <CategoryBlock>{post.category}</CategoryBlock>
    </StyledBlock>
  );
};

const Block = styled.div`
  width: 1200px;
  min-height: 1000px;
  margin: 30px auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
  padding: 40px 20px 0 20px;
`;

const StyledBlock = styled.div`
  border: 3px solid ${hoverColor};
  height: 400px;
  position: relative;
  border-radius: 10px;
  padding: 10px;
  h1 {
    margin-top: 10px;
    font-size: 25px;
    margin-bottom: 20px;
  }
  p {
    width: 100%;
    height: 215px;
    overflow: hidden;
  }
  div {
    display: 100%;
    display: flex;
    justify-content: right;
    :first-child {
      margin-right: 10px;
    }
    span {
      display: inline-block;
      color: rgb(110, 110, 110);
      font-weight: 600;
      font-size: 15px;
    }
  }
  .board-btn {
    display: flex;
    position: absolute;
    top: 10px;
    right: 10px;
    button {
      padding: 5px;
      border-radius: 10px;
      color: white;
      font-size: 10px;
      background-color: ${mainColor};
      &:nth-child(2) {
        background-color: #dd0000;
      }
    }
  }
`;

const WriteBlock = styled.button`
  border: 3px solid ${hoverColor};
  border-radius: 15px;
  position: fixed;
  top: 70px;
  right: 20px;
  padding: 10px 20px;
  &:hover {
    background-color: ${hoverColor};
    color: white;
  }
`;

const CategoryBlock = styled.div`
  position: absolute;
  padding: 5px 10px;
  border-radius: 10px;
  color: #ffffff;
  background-color: ${mainColor};
  bottom: 20px;
  right: 10px;
  text-align: center;
`;
