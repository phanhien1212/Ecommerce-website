import httpAxios from "../httpAxios";

function getUsers() {
  return httpAxios.get("users");
}
function getAdmins() {
  return httpAxios.get("/admins");
}
function getUsersTrash() {
  return httpAxios.get("users/trash");
}
function deleteUser(id) {
  return httpAxios.put(`user/delete/${id}`);
}
function destroy(id) {
  return httpAxios.delete(`user/destroy/${id}`);
}
function store(data) {
  return httpAxios.post("user/", data);
}
function store1(data) {
  return httpAxios.post("users/create", data);
}
function update(id, data) {
  return httpAxios.put(`user/${id}`, data);
}
function updateStatus(id) {
  return httpAxios.put(`user/updatestatus/${id}`);
}

function restore(id, data) {
  return httpAxios.put(`user/restore/${id}`, data);
}
function register(formData) {
  return httpAxios.post(`register`, formData);
}
function login(formData) {
  return httpAxios.post(`login`, formData);
}
function getById(id) {
  return httpAxios.get(`user/${id}`);
}
function updateRole(id,data) {
  return httpAxios.put(`user/updaterole/${id}`,data);
}

const UserService = {
  register: register,
  login: login,
  getById: getById,
  getUsers: getUsers,
  getUsersTrash: getUsersTrash,
  deleteUser: deleteUser,
  getAdmins: getAdmins,
  destroy: destroy,
  store: store,
  update: update,
  updateStatus: updateStatus,
  restore: restore,
  store1: store1,
  updateRole: updateRole,
};
export default UserService;
