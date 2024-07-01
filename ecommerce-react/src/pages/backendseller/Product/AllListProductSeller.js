import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import { urlImage } from "../../../config";
import CategoryService from "../../../service/CategoryService";
import CustomerService from "../../../service/CustomerService";

const ListProductSeller = () => {
  const [products, setProducts] = useState([]);
  const sellerId = localStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);
  const [initialProducts, setInitialProducts] = useState([]);
  const [inputname, setInputName] = useState("");
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    (async () => {
      const result = await ProductService.productsellerid(sellerId);
      setProducts(result.data);
      setInitialProducts(result.data);
      const resultUser = await CustomerService.getbyid(sellerId);
      const categoryResult = await CategoryService.getList();
      setCategories(categoryResult.data);
      setUser(resultUser.data);
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

  //Phân Trang
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Số lượng mục trên mỗi trang
  const pageCount = Math.ceil(products.length / itemsPerPage);
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = products.slice(startIndex, endIndex);
  //EndPhaTrang
  const handleFilter = (event) => {
    event.preventDefault();
    document.getElementById("exampleFormControlInput1").disabled = true;

    const inputfilter = document.getElementById(
      "exampleFormControlInput1"
    ).value;
    const filteredProducts = products.filter((product) =>
      product.name.includes(inputfilter)
    );
    setProducts(filteredProducts);
  };

  const resetFilter = () => {
    // Reset products to initial list
    setProducts(initialProducts);
    document.getElementById("exampleFormControlInput1").disabled = false;
    setInputName("");
  };
  const handleDelete = async (id) => {
    try {
      const result = await ProductService.destroy(id);
      // Nếu đang tìm kiếm, cập nhật lại dữ liệu tìm kiếm
      if (result.status === 204) {
        setLoad(Date.now());
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
                <Link className="colorshopee fw-bold" to="">
                  Tất cả
                </Link>
              </div>
              <div className="p-2 me-3 my-auto">
                <Link to="/seller/productseller/productactive">
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
                <span>{products.length}</span> Sản Phẩm
              </h5>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-7" />
                  <div className="col-md-5">
                    <div className="p-2">
                      <Link
                        style={{ fontSize: 14, width: 220 }}
                        to="/seller/product/create"
                        className="text-light btn btn btn-danger align-items-center mx-auto"
                      >
                        + Thêm một sản phẩm mới
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
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
                    <td>
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
                            data-bs-target={"#staticBackdrop" + product.id}
                          >
                            Xóa
                          </button>
                          {/* Modal */}
                          <div
                            className="modal fade"
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
                                    id={"buttonDelete" + product.id}
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

export default ListProductSeller;
