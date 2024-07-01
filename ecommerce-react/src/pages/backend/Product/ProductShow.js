import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import { Link, useParams } from "react-router-dom";
import { urlImage } from "./../../../config";
import CategoryService from "../../../service/CategoryService";
import UserService from "../../../service/UserService";
import NotificationService from "../../../service/NotificationService";
import { ToastContainer, toast } from "react-toastify";

const ProductShow = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [attribute, setAttribute] = useState([]);
  const [load, setLoad] = useState(Date.now());
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    (async () => {
      const resultProduct = await ProductService.getById(id);
      setProduct(resultProduct.data);
      const resultProductAttribute = await ProductService.getattribute(id);
      setAttribute(resultProductAttribute.data);
      const resultCategories = await CategoryService.getCategory();
      setCategories(resultCategories.data);
      const resultUsers = await UserService.getUsers();
      setUsers(resultUsers.data);
    })();
  }, [product]);
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
        toast.success(`Sản phẩm ${id} đã được xác nhận!`)
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm hoặc gửi thông báo:", error);

      if (error.response) {
        console.error("Thông báo lỗi từ máy chủ:", error.response.data.message);
      }
    }
  };
  const handleReport = async (id, sellerid) => {
    try {
      const status = 3;
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
    <div className="content">
      <ToastContainer/>
      <section className="content-header my-2">
        <h1 className="d-inline">Chi tiết</h1>
        <div className="row mt-2 align-items-center">
          <div className="col-md-12 text-end">
            <Link to="/admin/product" className="btn btn-primary btn-sm">
              <i className="fa fa-arrow-left" /> Về danh sách
            </Link>
            {product.status === 0 ? (
              <>
                <button
                  type="button"
                  className="btn btn-danger btn-sm ms-2"
                  data-bs-toggle="modal"
                  data-bs-target={`#staticBackdrop${product.id}`}
                >
                  Xác nhận nhanh
                </button>
                <div
                  className="modal fade"
                  id={`staticBackdrop${product.id}`}
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  tabIndex={-1}
                  aria-labelledby={`staticBackdropLabel${product.id}`}
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1
                          className="modal-title fs-5"
                          id={`staticBackdropLabel${product.id}`}
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
                            <img
                              className="img-fluid"
                              src={urlImage + "product/" + product.image}
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
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          id={"buttonDelete" + product.id}
                          className="btn btn-danger"
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
              </>
            ) : (
              ""
            )}
            {product.status !== 3 ? (
              <button
                onClick={() => handleReport(product.id, product.seller_id)}
                className="btn btn-danger btn-sm ms-2"
              >
                Báo cáo vi phạm
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
      <section className="content-body my-2">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: 250 }}>Tên trường</th>
              <th>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ID</td>
              <td>{product.id}</td>
            </tr>
            <tr>
              <td>Hình ảnh</td>
              <td>
                <img
                  className="img-fluid"
                  style={{ width: 100, height: 100 }}
                  src={urlImage + "product/" + product.image}
                  alt={product.image}
                />
              </td>
            </tr>
            <tr>
              <td>Tên sản phẩm</td>
              <td>{product.name}</td>
            </tr>
            <tr>
              <td>Ngành hàng</td>
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
            </tr>
            <tr>
              <td>Mô tả sản phẩm</td>
              <td>{product.description}</td>
            </tr>

            <tr>
              <td>Chi tiết sản phẩm</td>
              <td>{product.detail}</td>
            </tr>
            <tr>
              {attribute.attribute_name1 === "" ? null : (
                <>
                  <td>{attribute.attribute_name1}</td>
                  <td>{attribute.attribute_value1}</td>
                </>
              )}
            </tr>
            <tr>
              {attribute.attribute_name2 === "" ? null : (
                <>
                  <td>{attribute.attribute_name2}</td>
                  <td>{attribute.attribute_value2}</td>
                </>
              )}
            </tr>

            <tr>
              <td>Giá bán</td>
              <td>{product.price}</td>
            </tr>
            <tr>
              <td>Số lượng tồn kho</td>
              <td>{product.stockquantity}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ProductShow;
