import axios from "axios";

const backendPortNumber = "5001";
const serverUrl =
  "http://" + window.location.hostname + ":" + backendPortNumber;

// 각 필드 대장 컴포넌트에서 userId의 FieldName 데이터 요청하기
// [get]  users/:user-id/educations
const getDatas = async (userId, FieldName) => {
  console.log(
    `%cGET 요청: ${serverUrl}/users/${userId}/${FieldName}s`,
    "color: #a25cd1;"
  );

  return axios.get(`${serverUrl}/users/${userId}/${FieldName}s`, {
    // JWT 토큰을 헤더에 담아 백엔드 서버에 보냄.
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

/*
// FieldName의 documentId 데이터 불러오기
const getData = async (documentId, FieldName) => {
  try {
    return await axios.post(`${serverUrl}/${FieldName}/${documentId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
      },
    });
  } catch (err) {
    console.log(`${FieldName}의 ${documentId} 포스트 가져오기 실패`);
  }
};
*/

// FieldName에 newData 추가하기
// users/:user-id/educations
const addData = async (userId, FieldName, newData) => {
  const bodyData = JSON.stringify(newData);

  console.log(
    `%cPOST 요청:${serverUrl}/users/${userId}/${FieldName}s`,
    "color: #296aba;"
  );
  console.log(`%cPOST 요청 데이터: ${bodyData}`, "color: #296aba;");

  return axios.post(`${serverUrl}/users/${userId}/${FieldName}s`, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

// userId의 FieldName 필드에 data 업데이트하기
const updateData = async (documentId, FieldName, updateData) => {
  const bodyData = JSON.stringify(updateData);

  console.log(
    `%cPUT 요청: ${serverUrl}/${FieldName}s/${documentId}s`,
    "color: #059c4b;"
  );
  console.log(`%cPUT 요청 데이터: ${bodyData}`, "color: #059c4b;");

  return axios.put(`${serverUrl}/${FieldName}s/${documentId}`, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

// userId의 FieldName 필드에 data 삭제하기
const deleteData = async (documentId, FieldName) => {
  console.log(
    `%cDEL 요청: ${serverUrl}/${FieldName}s/${documentId}`,
    "color: #00d9ff;"
  );

  axios.delete(`${serverUrl}/${FieldName}s/${documentId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

// tryCatch를 거쳐가도 될듯

export { addData, updateData, deleteData, getDatas };
