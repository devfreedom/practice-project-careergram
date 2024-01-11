import React, { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";
import { UserStateContext } from "../../App";
import NetworkUserCard from "./NetworkUserCard";
import { userPagenation } from "../../services/ect";
import Pagination from "./Pagination";
import Loading from "../common/Loading";
import { AddContext } from "../../contexts/AddContext";
import { useNavigate } from "react-router-dom";

function Network() {
  // useState 훅을 통해 users 상태를 생성함, 응답의 users와 구분.
  const [stateUsers, setUsers] = useState([]);
  const [stateTotalPages, setTotalPages] = useState(1);
  const [stateCurrentPage, setCurrentPage] = useState(1);

  const [isFetching, setIsFetching] = useState(false);
  const { added, setAdded } = useContext(AddContext);
  const navigate = useNavigate();

  const userState = useContext(UserStateContext);

  useEffect(() => {
    // "userlist" 엔드포인트로 GET 요청을 하고, users를 response의 data로 세팅함.
    if (added) {
      setAdded(false);
      navigate("/");
    }

    userPagenation(stateCurrentPage)
      .then((res) => {
        const { users, totalPages, currentPage } = res;

        setUsers(users);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
        setIsFetching(true);
      })
      .catch((error) => {
        console.error(error);
        alert("사용자 목록을 가져오는 데 실패했습니다.");
      });
  }, [stateCurrentPage]);

  if (!isFetching) {
    return <Loading />;
  }

  function handlePage(page) {
    setCurrentPage(page);
  }

  return (
    <>
      <UserBlock>
        {stateUsers.map((user) => (
          <NetworkUserCard
            className="networkUser"
            key={user.id}
            user={user}
            userState={userState}
          />
        ))}
      </UserBlock>
      <Pagination
        totalPages={stateTotalPages}
        currentPage={stateCurrentPage}
        handlePage={handlePage}
      />
    </>
  );
}

export default Network;

const UserBlock = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 0.2fr);
  grid-template-rows: 2;
  grid-gap: 20px;
  grid-column-gap: 20px;
  margin: 30px auto;
  margin-bottom: 20px;
  min-height: 800px;
`;
