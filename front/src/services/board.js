import axios from "axios";

const backendPortNumber = "5001";
// http://localhost:5001;
const serverUrl =
  "http://" + window.location.hostname + ":" + backendPortNumber;

// GET 요청 /users/:userid/posts
const boardUserGet = async (userId) => {
  console.log(
    `%cGET 요청: ${serverUrl}/users/${userId}/posts`,
    "color: #a25cd1;"
  );

  return axios.get(`${serverUrl}/users/${userId}/posts`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

// POST 요청 /users/:userid/posts
const boardUserPost = async (userId, data) => {
  const bodyData = JSON.stringify(data);
  console.log(
    `%cPOST 요청: ${serverUrl}/users/${userId}/posts`,
    "color: #a25cd1;"
  );

  return axios.post(`${serverUrl}/users/${userId}/posts`, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

// boarddocumentId GET /textboard/:documentid
const boardByDocument = async (documentId) => {
  console.log(
    `%cGET 요청: ${serverUrl}/textboard/${documentId}`,
    "color: #a25cd1;"
  );

  return axios.get(`${serverUrl}/textboard/${documentId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

// GET 요청 "/textboard/categories/:category"
const boardByCategory = async (category) => {
  console.log(
    `%cGET 요청: ${serverUrl}/textboard/categories/${category}`,
    "color: #a25cd1;"
  );

  return axios.get(`${serverUrl}/textboard/categories/${category}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

// GET 요청 "/textboard/categories"
const boardByALL = async () => {
  console.log(`%cGET 요청: ${serverUrl}/textboard`, "color: #a25cd1;");

  return axios.get(`${serverUrl}/textboard`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

const boardUserPut = async (documentId, data) => {
  const bodyData = JSON.stringify(data);
  console.log(
    `%cPOST 요청: ${serverUrl}/textboard/${documentId}`,
    "color: #a25cd1;"
  );

  return axios.put(`${serverUrl}/textboard/${documentId}`, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

//
const boardDelete = async (documentId) => {
  console.log(
    `%cDEL 요청: ${serverUrl}/textboard/${documentId}`,
    "color: #00d9ff;"
  );

  axios.delete(`${serverUrl}/textboard/${documentId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

export {
  boardUserGet,
  boardUserPost,
  boardByDocument,
  boardByCategory,
  boardByALL,
  boardDelete,
  boardUserPut,
};
