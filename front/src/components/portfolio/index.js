import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { UserStateContext } from "../../App";
import * as Api from "../../api";

import UserContainer from "./user/UserContainer";
import Loading from "../common/Loading";
import { AddContext } from "../../contexts/AddContext";

function Portfolio() {
  const navigate = useNavigate();
  const params = useParams();
  // portfolio의 주인을 담을 state를 생성
  const [portfolioOwner, setPortfolioOwner] = useState(null);
  // portfolio의 주인을 담는 state가 진행 중임을 담을 state를 생성
  const [isFetching, setIsFetching] = useState(true);

  const { added, setAdded } = useContext(AddContext);

  const userState = useContext(UserStateContext);

  const handleFetchOwner = async (ownerId) => {
    // ownerId의 user 데이터를 fetch함
    if (!ownerId) {
      return;
    }

    const res = await Api.get("users", ownerId);
    // 사용자 정보는 response의 data임.
    const ownerData = res.data;
    // portfolioOwner을 해당 사용자 정보로 세팅함.
    setPortfolioOwner(ownerData);
    // fetching 종료
    setIsFetching(false);
  };

  useEffect(() => {
    // 전역 상태의 user가 null이라면 로그인이 안 된 상태이므로, 로그인 페이지로 돌림.
    if (!userState.user) {
      navigate("/login", { replace: true });
      return;
    }
    // 추가될 반환값없는 라우터(교육라우터 제외 나머지)의 경우, 새로운 값을 넣는 대신 네트워크 페이지에 갔다가 다시 편집 모드로 돌아옴
    // 교육을 제외한 각 필드에서는 데이터가 추가될 경우 네트워크페이지에 갔다가 다시 돌아옴
    if (added) {
      setAdded(false);
    }

    if (params.userId) {
      // userId가 존재할 경우 유저id를 ownerId로 설정함.
      const ownerId = params.userId;
      // 해당 유저 id로 handleFetchOwner 함수를 실행함.
      if (ownerId !== portfolioOwner?.id) {
        handleFetchOwner(ownerId);
      }
    } else {
      // 본인의 포트폴리오일 경우 전역 상태의 user.id를 유저 id로 설정함.
      const ownerId = userState.user.id;
      // 해당 유저 id로 handleFetchOwner 함수를 실행함.
      if (ownerId !== portfolioOwner?.id) {
        handleFetchOwner(ownerId);
      }
    }
  }, [params, userState, navigate, portfolioOwner]);

  //fetching이 완료되면 if 문 종료
  if (isFetching) {
    return <Loading />;
  }

  return (
    <UserContainer
      portfolioOwnerId={portfolioOwner.id}
      isEditable={portfolioOwner.id === userState.user?.id} // 로그인 user의 portfolio면 isEditable
    />
  );
}

export default Portfolio;
