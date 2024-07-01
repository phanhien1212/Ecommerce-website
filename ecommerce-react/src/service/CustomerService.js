import httpAxios from "../httpAxios";

function getCustomers() {
  return httpAxios.get("customers");
}
function getById(id) {
  return httpAxios.get(`customer/${id}`);
}
function getCustomersTrash() {
  return httpAxios.get("customers/trash");
}
function deleteCustomer(id) {
  return httpAxios.put(`customer/delete/${id}`);
}
function destroy(id) {
  return httpAxios.delete(`customer/destroy/${id}`);
}
function update(id, data) {
  return httpAxios.put(`customer/update/${id}`, data);
}

function restore(id) {
  return httpAxios.put(`customer/restore/${id}`);
}
function register(formData) {
  return httpAxios.post(`register`, formData);
}
function login(formData) {
  return httpAxios.post(`login`, formData);
}
function getbyid(id) {
  return httpAxios.get(`user/${id}`);
}
function getall() {
  return httpAxios.get(`users`);
}
function addadmin(formData) {
  return httpAxios.post(`user`, formData);
}

const CustomerService = {
  getCustomers: getCustomers,
  getCustomersTrash: getCustomersTrash,
  getById: getById,
  deleteCustomer: deleteCustomer,
  destroy: destroy,
  update: update,
  restore: restore,
  register: register,
  login: login,
  getbyid: getbyid,
  addadmin: addadmin,
  getall: getall,
};
export default CustomerService;
