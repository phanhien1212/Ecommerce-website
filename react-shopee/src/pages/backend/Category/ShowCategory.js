import { Link, useNavigate, useParams } from "react-router-dom";
import CategoryService from "../../../service/CategoryService";
import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
import { ToastContainer, toast } from "react-toastify";
const ShowCategory = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await CategoryService.getById(id);
      setCategory(result.data);
      const resultCategories = await CategoryService.getCategory();
      setCategories(resultCategories.data);
    })();
  }, [id]);
  const navigate = useNavigate();
  const handleDelete = async (id) => {
    try {
      const result = await CategoryService.destroy(id);
      // Nếu đang tìm kiếm, cập nhật lại dữ liệu tìm kiếm
      if (result.status === 204) {
        navigate("/admin/category");
        toast.success("Xóa danh mục thành công!");
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);

      if (error.response) {
        console.error("Thông báo lỗi từ máy chủ:", error.response.data.message);
      }
    }
  };
  return (
    <div>
         <ToastContainer />
      <section className="content-header my-2">
        <h1 className="d-inline">Chi tiết</h1>
        <div className="row mt-2 align-items-center">
          <div className="col-md-12 text-end">
            <Link to="/admin/category" className="btn btn-primary btn-sm me-2">
              <i className="fa fa-arrow-left" /> Về Danh Sách
            </Link>
            <Link
              to={"/admin/category/edit/" + category.id}
              className="btn btn-success btn-sm me-2"
            >
              <i className="fa fa-edit" /> Chỉnh Sửa
            </Link>
            {/* Button trigger modal */}
            <button
              type="button"
              className="btn btn-danger btn-sm"
              data-bs-toggle="modal"
              data-bs-target={"#staticBackdrop" + category.id}
            >
              Xóa Danh Mục
            </button>
            {/* Modal */}
            <div
              className="modal fadein"
              id={"staticBackdrop" + category.id}
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex={-1}
              aria-labelledby={"staticBackdropLabel" + category.id}
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
                      <div className="p-2" style={{ width: 100, height: 100 }}>
                        {" "}
                        <img
                          className="img-fluid"
                          src={urlImage + "category/" + category.image}
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
                      onClick={() => handleDelete(category.id)}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="content-body my-2">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: 180 }}>Tên trường</th>
              <th>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ID</td>
              <td>{category.id}</td>
            </tr>
            <tr>
              <td>Tên Danh Mục</td>
              <td>{category.name}</td>
            </tr>
            {category.parent_id !== 0 ? (
              <tr>
                <td>Danh Mục Cha</td>
                <td>
                  {" "}
                  {categories
                    .filter((user) => user.id === category.parent_id)
                    .map((user) => user.name)
                    .join("") || ""}
                </td>
              </tr>
            ) : (
              ""
            )}
            <tr>
              <td>Hình Ảnh</td>
              <td>
                <img
                  className="img-fluid"
                  style={{ width: 100, height: 100 }}
                  src={urlImage + "category/" + category.image}
                  alt={category.image}
                />
              </td>
            </tr>
            <tr>
              <td>Mô Tả</td>
              <td>{category.description}</td>
            </tr>
            <tr>
              <td>Trạng Thái</td>
              <td>{category.status === 0 ? "Đã Ẩn" : "Đã Hiện"}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ShowCategory;
