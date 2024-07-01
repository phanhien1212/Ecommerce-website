import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
import CategoryService from "../../../service/CategoryService";
import {
  FaEdit,
  FaEye,
  FaToggleOff,
  FaToggleOn,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parent_id, setParentId] = useState("");
  const [created_by, SetCreatedBy] = useState(1);
  const [sort_order, SetSortOrder] = useState(1);
  const [status, setStatus] = useState(1);
  const [load, setLoad] = useState(Date.now());
  const [categoryId, setCategoryId] = useState("");
  useEffect(() => {
    (async () => {
      const result = await CategoryService.getCategory();
      setCategories(result.data);
      setLoad(Date.now());
    })();
  }, [load]);

  const handDelete = (id) => {
    (async () => {
      const result = await CategoryService.destroy(id);
      toast.success("Xóa danh mục thành công!");
    })();
  };

  const handleStatus = (id) => {
    (async () => {
      await CategoryService.updateStatus(id);
      toast.success("Thay đổi trạng thái thành công!");
    })();
  };

  const handSubmit = async (event) => {
    event.preventDefault();
    var image = document.getElementById("image");
    var category = new FormData();
    category.append("name", name);
    category.append("description", description);
    category.append("status", status);
    category.append("parent_id", categoryId);
    category.append("created_by", created_by);
    category.append("sort_order", sort_order);
    category.append("image", image.files.length === 0 ? "" : image.files[0]);
    (async () => {
      const result = await CategoryService.store(category);
      setLoad(Date.now());
      toast.success("Thêm sản phẩm mới thành công");
      setName("");
      setDescription("");
      setStatus(1);
      document.getElementById("image").innerText = "";
      setParentId(0);
    })();
  };
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25; // Số lượng mục trên mỗi trang
  const pageCount = Math.ceil(categories.length / itemsPerPage);
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = categories.slice(startIndex, endIndex);
  return (
    <div>
      <ToastContainer />
      <section className="content-header my-2">
        <h1 className="d-inline">Danh mục</h1>
        <hr style={{ border: "none" }} />
      </section>
      <section className="content-body my-2">
        <div className="row">
          <div className="col-md-4">
            <form onSubmit={handSubmit}>
              <div className="mb-3">
                <label>
                  <strong>Tên danh mục (*)</strong>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                  id="name"
                  placeholder="Nhập tên danh mục"
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Mô tả</strong>
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả"
                  rows={4}
                  className="form-control"
                  defaultValue={""}
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Danh mục cha</strong>
                </label>
                <select
                  name="parent_id"
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value={0}>Chọn danh mục</option>
                  {categories
                    .filter((category) => category.parent_id === 0)
                    .map((filteredCategory) => (
                      <option
                        key={filteredCategory.id}
                        value={filteredCategory.id}
                      >
                        {filteredCategory.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-3">
                <label>
                  <strong>Hình đại diện</strong>
                </label>
                <input type="file" id="image" className="form-control" />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Trạng thái</strong>
                </label>
                <select
                  name="status"
                  className="form-select"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value={1}>Xuất bản</option>
                  <option value={2}>Chưa xuất bản</option>
                </select>
              </div>
              <div className="mb-3 text-end">
                <button type="submit" className="btn btn-success" name="THEM">
                  <i className="fa fa-save" /> Lưu[Thêm]
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-8">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: 30 }}>
                    <input type="checkbox" id="checkboxAll" />
                  </th>
                  <th className="text-center" style={{ width: 90 }}>
                    Hình ảnh
                  </th>
                  <th>Tên danh mục</th>
                  <th>Tên slug</th>
                  <th className="text-center" style={{ width: 30 }}>
                    ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems &&
                  currentItems.map((category, index) => (
                    <tr className="datarow">
                      <td className="text-center">
                        <input type="checkbox" id="checkId" />
                      </td>
                      <td>
                        <img
                          className="img-fluid"
                          src={urlImage + "category/" + category.image}
                          alt="category.jpg"
                        />
                      </td>
                      <td>
                        <div className="name">
                          <Link href="category_index.html">
                            {category.name}
                          </Link>
                        </div>
                        <div className="function_style">
                          <button
                            onClick={() => handleStatus(category.id)}
                            className={
                              category.status === 1
                                ? "border-0 px-1 text-success"
                                : "border-0 px-1 text-danger"
                            }
                          >
                            {category.status === 1 ? (
                              <FaToggleOn />
                            ) : (
                              <FaToggleOff />
                            )}
                          </button>

                          <Link
                            to={"/admin/category/edit/" + category.id}
                            className="px-1 text-primary"
                          >
                            <FaEdit />
                          </Link>
                          <Link
                            to={"/admin/category/show/" + category.id}
                            className="px-1 text-info"
                          >
                            <FaEye />
                          </Link>
                          <button
                            type="button"
                            className="text-danger"
                            style={{ border: "none" }}
                            data-bs-toggle="modal"
                            data-bs-target={"#staticBackdrop" + category.id}
                          >
                            <FaTrash />
                          </button>
                          <div
                            className="modal fadein"
                            id={"staticBackdrop" + category.id}
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            tabIndex={-1}
                            aria-labelledby={
                              "staticBackdropLabel" + category.id
                            }
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h1
                                    className="modal-title fs-5"
                                    id={"staticBackdropLabel" + category.id}
                                  >
                                    Xóa Danh Mục
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  />
                                </div>
                                <div className="modal-body">
                                  <p>Bạn muốn xóa danh mục?</p>
                                  <div className="d-flex flex-row mb-3">
                                    <div
                                      className="p-2"
                                      style={{ width: 100, height: 100 }}
                                    >
                                      {" "}
                                      <img
                                        className="img-fluid"
                                        src={
                                          urlImage +
                                          "category/" +
                                          category.image
                                        }
                                        alt="category.jpg"
                                      />
                                    </div>
                                    <div className="p-2 d-flex align-items-center">
                                      <h5>{category.name}</h5>
                                    </div>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary "
                                    data-bs-dismiss="modal"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    type="button"
                                    id={"buttonDelete" + category.id}
                                    className="btn btn-danger "
                                    data-bs-dismiss="modal"
                                    onClick={() => handDelete(category.id)}
                                  >
                                    Xác nhận
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{category.slug}</td>
                      <td className="text-center">{category.id}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <nav aria-label="Phân trang">
              <ul className="pagination justify-content-center">
                <li className="page-item">
                  <Link
                    className={`page-link text-main ${
                      currentPage === 0 ? "disabled" : ""
                    }`}
                    to="#"
                    aria-label="Previous"
                    onClick={() => handlePageClick(currentPage - 1)}
                  >
                    <span aria-hidden="true">«</span>
                  </Link>
                </li>
                {[...Array(pageCount)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index ? "active" : ""
                    }`}
                  >
                    <Link
                      className="page-link text-main"
                      to="#"
                      onClick={() => handlePageClick(index)}
                    >
                      {index + 1}
                      {currentPage === index && (
                        <span className="sr-only">(current)</span>
                      )}
                    </Link>
                  </li>
                ))}
                <li className="page-item">
                  <Link
                    className={`page-link text-main ${
                      currentPage === pageCount - 1 ? "disabled" : ""
                    }`}
                    to="#"
                    aria-label="Next"
                    onClick={() => handlePageClick(currentPage + 1)}
                  >
                    <span aria-hidden="true">»</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListCategory;
