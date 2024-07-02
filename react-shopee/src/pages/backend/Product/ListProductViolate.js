import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import { urlImage } from "../../../config";
import UserService from "../../../service/UserService";
import CategoryService from "../../../service/CategoryService";
import NotificationService from "../../../service/NotificationService";
import { ToastContainer, toast } from "react-toastify";

const ListProductViolate = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    (async () => {
      const resultProducts = await ProductService.getList();
      const sortedProducts = resultProducts.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      const productwaitting=sortedProducts.filter(p=>p.status===3)
      setProducts(productwaitting);
      const resultUsers = await UserService.getUsers();
      setUsers(resultUsers.data);
      const resultCategories = await CategoryService.getCategory();
      setCategories(resultCategories.data);
    })();
  }, [products]);
  const handleConfirm = async (id, sellerid) => {
    try {
      const status = 1;
      var updateStatus = new FormData();
      updateStatus.append("status", status);
      const result = await ProductService.updatestatus(id, updateStatus);

      // Nếu đang tìm kiếm, cập nhật lại dữ liệu tìm kiếm
      console.log(result);

      if (result.status === 200) {
        const u = users.find((nd) => nd.id === sellerid);
        var username = u.username;
        const addNotification = new FormData();
        addNotification.append(
          "content",
          `${username} ơi, sản phẩm ${id} của bạn vừa được xác nhận, XEM NGAY`
        );
        addNotification.append("title", `Sản phẩm của bạn đã được xác nhận`);
        addNotification.append("recipient_id", sellerid);
        addNotification.append("status", 1);
        addNotification.append("link", `/seller/product/edit/${id}`);
        addNotification.append("role", `seller`);
        setLoad(Date.now());

        const resultNotification = await NotificationService.addNotification(
          addNotification
        );
        console.log(
          `Notification sent to user ${sellerid}`,
          resultNotification
        );
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm hoặc gửi thông báo:", error);

      if (error.response) {
        console.error("Thông báo lỗi từ máy chủ:", error.response.data.message);
      }
    }
  };

  return (
    <div>
      <section className="content-header my-2">
        <h1 className="d-inline">Tất cả sản phẩm</h1>
      </section>
      <section className="content-body my-2">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="text-center" style={{ width: 130 }}>
                Hình ảnh
              </th>
              <th style={{ width: 300 }}>Tên sản phẩm</th>
              <th style={{ width: 200 }}>Nhà bán hàng</th>
              <th>Danh mục sản phẩm</th>
              <th style={{ width: 300 }}>Trạng thái sản phẩm</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr className="datarow">
                <td>
                  <img
                    className="img-fluid"
                    src={urlImage + "product/" + product.image}
                    alt={product.image}
                  />
                </td>
                <td>
                  <div className="">
                    <a href="product_edit.html">{product.name}</a>
                  </div>

                  <div className="function_style">
                    {product.status === 0 ? (
                      <div>
                        {/* Button trigger modal */}
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ height: 20 }}
                          data-bs-toggle="modal"
                          data-bs-target={"#staticBackdrop" + product.id}
                        >
                          Xác nhận nhanh
                        </button>
                        {/* Modal */}
                        <div
                          className="modal fadein"
                          id={"staticBackdrop" + product.id}
                          data-bs-backdrop="static"
                          data-bs-keyboard="false"
                          tabIndex={-1}
                          aria-labelledby={"staticBackdropLabel" + product.id}
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5"
                                  id={"staticBackdropLabel" + product.id}
                                >
                                  Xác nhận sản phẩm
                                </h1>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                />
                              </div>
                              <div className="modal-body">
                                <p>Sản phẩm cần được xác nhận</p>
                                <div className="d-flex flex-row mb-3">
                                  <div
                                    className="p-2"
                                    style={{ width: 100, height: 100 }}
                                  >
                                    {" "}
                                    <img
                                      className="img-fluid"
                                      src={
                                        urlImage + "product/" + product.image
                                      }
                                      alt="product.jpg"
                                    />
                                  </div>
                                  <div className="p-2 d-flex align-items-center">
                                    <h5>{product.name}</h5>
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
                                  id={"buttonDelete" + product.id}
                                  className="btn btn-danger "
                                  data-bs-dismiss="modal"
                                  onClick={() =>
                                    handleConfirm(product.id, product.seller_id)
                                  }
                                >
                                  Xác nhận
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    <br />
                    <Link
                      to={"/admin/product/" + product.id}
                      className="px-1 rounded-2 mt-2 bg-info text-light"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </td>

                <td>
                  {users
                    .filter((user) => user.id === product.seller_id)
                    .map((user) => user.username)
                    .join("") || ""}
                </td>

                <td>
                  {(() => {
                    const category = categories.find(
                      (cat) => cat.id === product.category_id
                    );
                    if (!category) return "";

                    const parentCategory = categories.find(
                      (cat) => cat.id === category.parent_id
                    );
                    const categoryName = category.name;
                    const parentCategoryName = parentCategory
                      ? parentCategory.name
                      : "";

                    return parentCategoryName
                      ? `${parentCategoryName} > ${categoryName}`
                      : categoryName;
                  })()}
                </td>
                <td>
                  {" "}
                  {(() => {
                    switch (product.status) {
                      case 1:
                        return "Đang hoạt động";
                      case 0:
                        return "Chờ duyệt";
                      case 2:
                        return "Đã ẩn";
                      case 3:
                        return "Vi phạm";
                      default:
                        return "Hết hàng";
                    }
                  })()}
                </td>
                <td className="text-center" style={{ width: 30 }}>
                  {product.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ListProductViolate;
