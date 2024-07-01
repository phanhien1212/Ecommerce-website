import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import { urlImage } from "../../../config";
import UserService from "../../../service/UserService";
import CategoryService from "../../../service/CategoryService";
import NotificationService from "../../../service/NotificationService";

const ListProduct = () => {
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
      const product = sortedProducts.filter((p) => p.status !== 4);
      setProducts(product);

      const resultUsers = await UserService.getUsers();
      setUsers(resultUsers.data);

      const resultCategories = await CategoryService.getCategory();
      setCategories(resultCategories.data);
    })();
  }, [load]);

  const handleConfirm = async (id, sellerid) => {
    try {
      const status = 1;
      var updateStatus = new FormData();
      updateStatus.append("status", status);
      const result = await ProductService.updatestatus(id, updateStatus);

      if (result.status === 200) {
        const u = users.find((nd) => nd.id === sellerid);
        var username = u ? u.username : "Người dùng";
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

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Số lượng mục trên mỗi trang
  const pageCount = Math.ceil(products.length / itemsPerPage);
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = products.slice(startIndex, endIndex);

  return (
    <>
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
              {currentItems.map((product, index) => (
                <tr className="datarow" key={index}>
                  <td>
                    <img
                      className="img-fluid"
                      src={urlImage + "product/" + product.image}
                      alt={product.image}
                    />
                  </td>
                  <td>
                    <div className="">
                      <Link to={"/admin/product/" + product.id}>
                        {product.name}
                      </Link>
                    </div>

                    <div>
                      {product.status === 0 ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-danger"
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
                                      handleConfirm(
                                        product.id,
                                        product.seller_id
                                      )
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
                    </div>
                    <br />
                    <Link
                      to={"/admin/product/" + product.id}
                      className="px-1 rounded-2 mt-2 bg-info text-light"
                    >
                      Xem chi tiết
                    </Link>

                    {/* <div className="function_style">
                      {product.status === 0 ? (
                        <div>
                          <button
                            type="button"
                            className="btn btn-danger"
                            data-bs-toggle="modal"
                            data-bs-target={"#staticBackdrop" + product.id}
                          >
                            Xác nhận nhanh
                          </button>
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
                                      handleConfirm(
                                        product.id,
                                        product.seller_id
                                      )
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
                      
                    </div> */}
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
        </section>
      </div>
    </>
  );
};

export default ListProduct;
