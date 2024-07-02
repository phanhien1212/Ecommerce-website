import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import CategoryService from "../../../service/CategoryService";
import { Link } from "react-router-dom";
import { urlImage } from "../../../config";
import CustomerService from "../../../service/CustomerService";

const ProductActive = () => {
  const [products, setProducts] = useState([]);
  const sellerId = localStorage.getItem("userId");
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);

  const [productActives, setProductActives] = useState([]);
  const [load, setLoad] = useState(Date.now());
  const [initialProducts, setInitialProducts] = useState([]);
  const [inputname, setInputName] = useState("");
  useEffect(() => {
    (async () => {
      const result = await ProductService.productsellerid(sellerId);
      const categoryResult = await CategoryService.getList();
      const resultUser = await CustomerService.getbyid(sellerId);
      setUser(resultUser.data);
      setProducts(result.data);

      const productActive = result.data.filter(
        (product) => product.status === 1
      );
      setProductActives(productActive);
      setInitialProducts(productActive);

      setCategories(categoryResult.data);
    })();
  }, [load]);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Không có";
  };
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const handleFilter = (event) => {
    event.preventDefault();
    document.getElementById("exampleFormControlInput1").disabled = true;

    const inputfilter = document.getElementById(
      "exampleFormControlInput1"
    ).value;
    const filteredProducts = productActives.filter((product) =>
      product.name.includes(inputfilter)
    );
    setProductActives(filteredProducts);
  };

  //Phân Trang
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Số lượng mục trên mỗi trang
  const pageCount = Math.ceil(productActives.length / itemsPerPage);
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = productActives.slice(startIndex, endIndex);

  const resetFilter = () => {
    // Reset products to initial list
    setProductActives(initialProducts);
    document.getElementById("exampleFormControlInput1").disabled = false;
    setInputName("");
  };
  const handleDelete = async (id) => {
    try {
      const result = await ProductService.destroy(id);
      // Nếu đang tìm kiếm, cập nhật lại dữ liệu tìm kiếm
      setLoad(Date.now());
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);

      if (error.response) {
        console.error("Thông báo lỗi từ máy chủ:", error.response.data.message);
      }
    }
  };
  return (
    <div>
      <div className="d-flex p-2 row " style={{ height: 70 }}>
        <div className="col-md-12 border rounded-3 mt-2">
          <div className="mx-auto">
            <div className="d-flex flex-row mb-3 mt-5">
              <div
                className="p-2 border rounded-2 text-center mt-2 ms-2"
                id="filternameid"
                style={{
                  outline: "none",
                  boxShadow: "none",
                  width: 150,
                  fontSize: 14,
                  height: 34.6,
                }}
              >
                <p className="">Tên sản phẩm</p>
              </div>
              <div className="p-2">
                <input
                  type="text"
                  className="form-control border"
                  id="exampleFormControlInput1"
                  value={inputname}
                  onChange={(e) => setInputName(e.target.value)}
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    width: 400,
                    fontSize: 14,
                  }}
                  placeholder="Please input at least first 2 characters of word"
                />
              </div>
              <div className="p-2">
                <button
                  type="button"
                  onClick={handleFilter}
                  style={{ fontSize: 14 }}
                  className="btn btn-outline-danger mb-4"
                >
                  Tìm
                </button>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  onClick={resetFilter}
                  style={{ fontSize: 14 }}
                  className="btn btn-outline-dark mb-4"
                >
                  Nhập lại
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 border rounded-3 mt-4">
          <div className="col-md-12 border-bottom">
            <div className="d-flex flex-row mx-auto">
              <div className="p-2 me-3 my-auto">
                <Link className="" to={"/seller/productseller/" + user.id}>
                  Tất cả
                </Link>
              </div>
              <div className="p-2 me-3 my-auto">
                <Link
                  to="/seller/productseller/productactive"
                  className="text-danger fw-bold"
                >
                  Đang hoạt động{" "}
                </Link>
              </div>
              <div className="p-2 me-3 my-auto">
                <Link to="/seller/productseller/productoutstock">Hết hàng</Link>
              </div>
              <div className="p-2 me-3 my-auto">
                <Link to="/seller/productseller/productwaitting">
                  Chờ duyệt
                </Link>
              </div>
              <div className="p-2 me-3 my-auto">
                <Link to="/seller/productseller/productviolate">Vi phạm</Link>
              </div>
              <div className="p-2 me-3 my-auto">
                <Link to="/seller/productseller/producthidden">Đã ẩn</Link>
              </div>
            </div>
          </div>
          <div className="col-md-12 mt-3">
            <div className="row">
              <h5 className="col-md-6 mt-2">
                <span>{productActives.length}</span> Sản Phẩm
              </h5>
            </div>
          </div>
          <div className="col-md-12 ">
            <table className="table mb-5  mt-3">
              <thead className>
                <tr className="table-light">
                  <th scope="col">
                    <input type="checkbox" id="checkboxAll" />
                  </th>
                  <th className="text-center" style={{ width: 130 }}>
                    Hình ảnh
                  </th>
                  <th scope="col" style={{ width: 400 }}>
                    Tên sản phẩm
                  </th>
                  <th scope="col">Phân loại hàng</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Kho hàng</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((product) => (
                  <tr className="table">
                    <td scope="col">
                      <input type="checkbox" id="checkboxAll" />
                    </td>
                    <td>
                      <img
                        className="img-fluid"
                        src={urlImage + "product/" + product.image}
                        alt="product.jpg"
                      />
                    </td>
                    <td>
                      <p className="colorgray small">
                        {product.status === 2 ? "Đã ẩn" : ""}
                      </p>
                      <Link>{product.name}</Link>
                    </td>
                    <td>{getCategoryName(product.category_id)}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td className="text-center">
                      {product.stockquantity}
                      <p className="text-warning small">
                        {product.stockquantity === 0 ? "Hết hàng" : ""}
                      </p>
                    </td>
                    <td>
                      <p>
                      <Link to={"/seller/product/edit/" + product.id}>
                          Cập Nhật
                        </Link>
                      </p>
                      <div>
                        <div>
                          {/* Button trigger modal */}
                          <button
                            type="button"
                            className="btn btn-link"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop"
                          >
                            Xóa
                          </button>
                          {/* Modal */}
                          <div
                            className="modal fade"
                            id="staticBackdrop"
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            tabIndex={-1}
                            aria-labelledby="staticBackdropLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h1
                                    className="modal-title fs-5"
                                    id="staticBackdropLabel"
                                  >
                                    Xóa sản phẩm
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  />
                                </div>
                                <div className="modal-body">
                                  <p>
                                    Bạn có chắc muốn xóa sản phẩm này? Lưu ý:
                                    Sau khi xóa, bạn không thể hoàn tác hay khôi
                                    phục sản phẩm.
                                  </p>
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
                                    id="buttonDelete"
                                    className="btn btn-danger "
                                    data-bs-dismiss="modal"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <div className="d-flex justify-content-center mt-5">
            <img style={{width: 100, height: 100}} className src="https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png" alt="eded" />
            <p className="mt-5">Không tìm thấy sản phẩm</p>
          </div> */}
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
      </div>
    </div>
  );
};

export default ProductActive;
