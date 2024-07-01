import httpAxios from "../httpAxios";

function getList() {
  return httpAxios.get("pages");
}

function getById(id) {
  return httpAxios.get(`page/${id}`);
}
function getList1() {
  return httpAxios.get("page/trash");
}
function store(data) {
  return httpAxios.post("page", data);
}
function deletePage(id) {
  return httpAxios.post(`page/delete/${id}`);
}
function destroy(id) {
  return httpAxios.delete(`page/destroy/${id}`);
}
function update(id, data) {
  return httpAxios.put(`page/${id}`, data);
}
function updateStatus(id) {
  return httpAxios.put(`/page/updatestatus/${id}`);
}
function restore(id) {
  return httpAxios.post(`page/restore/${id}`);
}
const PageService = {
  getById: getById,
  getList: getList,
  store: store,
  destroy: destroy,
  updateStatus: updateStatus,
  update: update,
  deletePage: deletePage,
  getList1: getList1,
  restore: restore,
};
export default PageService;
