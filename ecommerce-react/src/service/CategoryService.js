import httpAxios from "../httpAxios";

function getList() {
  return httpAxios.get("categories");
}
function getCategory() {
  return httpAxios.get("categories");
}
function getCategoriesActive() {
  return httpAxios.get("categoriesActive");
}
function getCategoryTrash() {
  return httpAxios.get("categories/trash");
}

function getById(id) {
  return httpAxios.get(`category/${id}`);
}
function store(data) {
  return httpAxios.post("category", data);
}
function deleteCategory(id) {
  return httpAxios.put(`category/delete/${id}`);
}
function destroy(id) {
  return httpAxios.delete(`category/destroy/${id}`);
}
function update(id, data) {
  return httpAxios.put(`category/update/${id}`, data);
}
function updateStatus(id) {
  return httpAxios.put(`category/updatestatus/${id}`);
}
function restore(id) {
  return httpAxios.put(`category/restore/${id}`);
}
function getChildren(parentId) {
  return httpAxios.get(`children/${parentId}`)

}
const CategoryService = {
  getById: getById,
  getCategory: getCategory,
  getCategoriesActive,getCategoriesActive,
  getChildren,getChildren,
  getList: getList,
  getCategoryTrash: getCategoryTrash,
  store: store,
  destroy: destroy,
  update: update,
  updateStatus: updateStatus,
  delete: deleteCategory,
  restore: restore,
};
export default CategoryService;
