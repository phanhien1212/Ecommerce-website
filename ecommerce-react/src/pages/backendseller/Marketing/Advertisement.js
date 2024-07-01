import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import { urlImage } from "../../../config";
import { Link } from "react-router-dom";
import CategoryService from "../../../service/CategoryService";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const Advertisement = () => {
  const sellerId = localStorage.getItem("userId");
  const [categories, setCategories] = useState([]);
  const [productsale, setProductSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [promotionName, setPromotionName] = useState("");
  const [datebegin, setDateBegin] = useState("");
  const [dateend, setDateEnd] = useState("");
  const [load, setLoad] = useState(Date.now());
  const [productSelect, setProductSelect] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await ProductService.productsellerid(sellerId);
      const productActive = result.data.filter(
        (product) => product.status === 1 && product.stockquantity >= 1
      );
      setProducts(productActive);
      const resultProductSales = await ProductService.getproductsalebyseller(
        sellerId
      );
      setProductSales(resultProductSales.data);
      const categoryResult = await CategoryService.getList();
      setCategories(categoryResult.data);
    })();
  }, [load, productsale, sellerId]);
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
  const handleSelectProduct = async () => {
    try {
      const productidchecked = document.querySelectorAll(".productId");
      const updatedProductSelect = [...productSelect]; // Tạo một bản sao của productSelect trước đó

      productidchecked.forEach(async function (item) {
        if (item.checked) {
          // Kiểm tra xem item có tồn tại trong mảng updatedProductSelect không
          const exists = updatedProductSelect.some(
            (product) => product.id === item.value
          );
          if (!exists) {
            try {
              const result = await ProductService.getById(item.value);
              const ElImage = result.data.image;
              const ElName = result.data.name;
              const ElQty = result.data.stockquantity;
              const ElPrice = result.data.price;
              const productselect = {
                id: item.value,
                image: ElImage,
                name: ElName,
                stockquantity: ElQty,
                price: ElPrice,
              };
              updatedProductSelect.push(productselect); // Thêm sản phẩm mới vào mảng
            } catch (error) {
              console.error("Lỗi lấy thông tin sản phẩm:", error);
            }
          }
        }
      });
      setLoad(Date.now());
      setProductSelect(updatedProductSelect); // Cập nhật productSelect với mảng mới
    } catch (error) {
      console.error("Lỗi khi xử lý sản phẩm:", error);
    }
  };
  const handleStatus = async (id) => {
    try {
      await ProductService.updatestatusproductsale(id);
      // Nếu bạn muốn cập nhật trạng thái ngay lập tức sau khi cập nhật trên server,
      // bạn có thể gọi getList để làm mới danh sách thương hiệu
      setLoad(Date.now());
      // Kiểm tra xem có đang ở chế độ tìm kiếm hay không
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thương hiệu:", error);

      if (error.response) {
        console.error("Thông báo lỗi từ máy chủ:", error.response.data.message);
      }
    }
  };
  const handleAddPriceProduct = async () => {
    try {
      // Lặp qua mảng productSelect để thêm flash sale cho mỗi sản phẩm
      for (const product of productSelect) {
        try {
          const discountproduct = document.getElementById(
            `discount` + product.id
          ).value;
          const pricesaleproduct = document.getElementById(
            `pricesale` + product.id
          ).value;

          var addProductSale = new FormData();
          addProductSale.append("product_id", product.id);
          addProductSale.append("pricesale", parseFloat(pricesaleproduct));
          addProductSale.append("discount", parseFloat(discountproduct));
          addProductSale.append("promotion_name", promotionName);
          addProductSale.append("datebegin", datebegin);
          addProductSale.append("dateend", dateend);
          addProductSale.append("status", 1);
          addProductSale.append("created_by", sellerId);

          await ProductService.addproductsale(addProductSale);

          // Thực hiện các hoạt động khác ở đây, ví dụ: gửi dữ liệu đến cơ sở dữ liệu
        } catch (error) {
          console.error("Lỗi lấy thông tin sản phẩm:", error);
        }
      }
      toast.success("Thêm sản phẩm khuyến mãi thành công!");
    } catch (error) {
      console.error("Lỗi khi xử lý sản phẩm:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await ProductService.deleteSale(id);
      // Nếu bạn muốn cập nhật trạng thái ngay lập tức sau khi cập nhật trên server,
      // bạn có thể gọi getList để làm mới danh sách thương hiệu
      setLoad(Date.now());
      // Kiểm tra xem có đang ở chế độ tìm kiếm hay không
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thương hiệu:", error);

      if (error.response) {
        console.error("Thông báo lỗi từ máy chủ:", error.response.data.message);
      }
    }
  };
  return (
    <>
      <ToastContainer position="top-center" />
      <div className="row border rounded-2 f6f6f6 ">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-7">
              <h5 className="mt-3 ms-2">Tạo khuyến mãi</h5>
              <p className="mt-3 ms-2 colorgray small">
                Thiết lập các chương trình khuyến mãi riêng của Shop để tăng
                Doanh số
              </p>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-end">
                <div className="p-2">
                  <button
                    type="button"
                    style={{ fontSize: 14, width: 100 }}
                    className="btn btn btn-danger align-items-center mx-auto mt-2"
                    data-bs-target="#exampleModalToggle"
                    data-bs-toggle="modal"
                  >
                    + Tạo
                  </button>
                  <div
                    className="modal fade modal-xl"
                    id="exampleModalToggle"
                    aria-hidden="true"
                    aria-labelledby="exampleModalToggleLabel"
                    tabIndex={-1}
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="staticBackdropLabel"
                          >
                            Chương trình khuyến mãi của Shop
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="modal-body">
                          <h5>Thông tin cơ bản</h5>
                          <div className="row">
                            <label
                              htmlFor="colFormLabel"
                              className="col-sm-3 col-form-label"
                            >
                              Tên chương trình khuyến mãi
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                min={5000}
                                value={promotionName}
                                onChange={(e) =>
                                  setPromotionName(e.target.value)
                                }
                                style={{
                                  outline: "none",
                                  boxShadow: "none",
                                  width: 500,
                                }}
                                className="form-control border"
                                id="colFormLabel"
                                placeholder="Nhập vào"
                              />
                              <p className="small ms-2 colorgray">
                                Tên chương trình khuyến mãi sẽ không hiển thị
                                với người mua
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row mb-3 mt-2 ms-2">
                          <div className="row">
                            <div className="col-md-7 row">
                              <label
                                htmlFor="colFormLabel"
                                className="col-sm-3 col-form-label"
                              >
                                Thời gian khuyến mãi
                              </label>
                              <div className="col-sm-4">
                                <input
                                  type="date"
                                  value={datebegin}
                                  onChange={(e) => setDateBegin(e.target.value)}
                                  style={{
                                    outline: "none",
                                    boxShadow: "none",
                                    width: 200,
                                  }}
                                  className="form-control border"
                                  id="colFormLabel"
                                />
                              </div>
                              <div className="col-sm-1">
                                <span className="ms-3 ">-</span>
                              </div>
                              <div className="col-sm-4">
                                <input
                                  type="date"
                                  value={dateend}
                                  onChange={(e) => setDateEnd(e.target.value)}
                                  style={{
                                    outline: "none",
                                    boxShadow: "none",
                                    width: 200,
                                  }}
                                  className="form-control border"
                                  id="colFormLabel"
                                />
                              </div>
                            </div>
                            <div className="col-md-5" />
                          </div>
                        </div>
                        <div className="modal-body">
                          <h5 className="mt-2">Sản phẩm khuyến mãi</h5>
                          <p className="small ms-2 colorgray">
                            Thêm sản phẩm vào chương trình khuyến mãi và thiết
                            lập giá khuyến mãi
                          </p>
                          <div className="row">
                            <div className="col-md-12 ">
                              <table className="table mb-5">
                                <thead className>
                                  <tr className="table-secondary">
                                    <th scope="col" style={{ width: 300 }}>
                                      Sản phẩm
                                    </th>
                                    <th scope="col">Giá gốc</th>
                                    <th scope="col">Khuyến mãi (%)</th>
                                    <th scope="col">Giá sau KM</th>

                                    <th scope="col">Kho hàng</th>

                                    <th scope="col">Hành động</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {productSelect.map((product) => (
                                    <tr>
                                      <td>
                                        <div class="d-flex flex-row mb-3">
                                          <div class="p-2">
                                            {" "}
                                            <img
                                              className="img-fluid"
                                              style={{ width: 114 }}
                                              src={
                                                urlImage +
                                                "product/" +
                                                product.image
                                              }
                                              alt="product.jpg"
                                            />
                                          </div>
                                          <div class="p-2">
                                            {" "}
                                            <Link>{product.name}</Link>
                                          </div>
                                        </div>
                                      </td>
                                      <td>{product.price}</td>
                                      <td>
                                        {" "}
                                        <input
                                          className="border ms-3"
                                          style={{ width: 60 }}
                                          id={"discount" + product.id}
                                          type="number"
                                          min={1}
                                        />
                                      </td>

                                      <td>
                                        {" "}
                                        <input
                                          className="border "
                                          style={{ width: 100 }}
                                          id={"pricesale" + product.id}
                                          type="number"
                                          min={1}
                                        />
                                      </td>
                                      <td>{product.stockquantity}</td>
                                      <td> </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            className="btn btn-outline-danger"
                            data-bs-target="#exampleModalToggle2"
                            data-bs-toggle="modal"
                          >
                            Chọn sản phẩm
                          </button>
                          <button
                            className="btn btn-danger"
                            data-bs-target="#exampleModalToggle"
                            data-bs-toggle="modal"
                            onClick={() => handleAddPriceProduct()}
                          >
                            Xác nhận
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="modal fade modal-xl"
                    id="exampleModalToggle2"
                    aria-hidden="true"
                    aria-labelledby="exampleModalToggleLabel2"
                    tabIndex={-1}
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalToggleLabel2"
                          >
                            Chọn Sản Phẩm
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="modal-body ">
                          <div className="row">
                            <div className="col-md-12 ">
                              <table className="table mb-5">
                                <thead className>
                                  <tr className="table-secondary">
                                    <th scope="col">
                                      <input type="checkbox" id="checkboxAll" />
                                    </th>
                                    <th scope="col" style={{ width: 400 }}>
                                      Sản phẩm
                                    </th>
                                    <th scope="col">Loại hàng</th>
                                    <th scope="col">Giá</th>
                                    <th scope="col">Kho hàng</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {products.map((product) => (
                                    <tr>
                                      <td>
                                        {" "}
                                        <input
                                          type="checkbox"
                                          className="productId"
                                          value={product.id}
                                          id={"productId" + product.id}
                                        />
                                      </td>
                                      <td>
                                        <div class="d-flex flex-row mb-3">
                                          <div class="p-2">
                                            {" "}
                                            <img
                                              className="img-fluid"
                                              style={{ width: 114 }}
                                              src={
                                                urlImage +
                                                "product/" +
                                                product.image
                                              }
                                              alt="product.jpg"
                                            />
                                          </div>
                                          <div class="p-2">
                                            {" "}
                                            <Link>{product.name}</Link>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        {getCategoryName(product.category_id)}
                                      </td>
                                      <td>{formatPrice(product.price)}</td>
                                      <td>{product.stockquantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            className="btn btn-danger"
                            data-bs-target="#exampleModalToggle"
                            onClick={() => handleSelectProduct()}
                            data-bs-toggle="modal"
                          >
                            Xác nhận
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h5 className="mt-3 ms-2">Danh sách chương trình</h5>
          </div>
          <div className="row">
            <div className="col-md-12 ">
              <table className="table mb-5">
                <thead className>
                  <tr className="table-secondary">
                    <th scope="col">Tên chương trình</th>
                    <th scope="col" style={{ width: 400 }}>
                      Sản phẩm
                    </th>
                    <th scope="col">Thời gian</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {productsale.map((product) => (
                    <tr>
                      <td>
                        <p>{product.promotion_name}</p>
                      </td>

                      <td>
                        <div class="d-flex flex-row mb-3">
                          <div class="p-2">
                            {" "}
                            <img
                              className="img-fluid"
                              style={{ width: 114 }}
                              src={
                                urlImage + "product/" + product.product_image
                              }
                              alt="product.jpg"
                            />
                          </div>
                          <div class="p-2">
                            {" "}
                            <Link>{product.product_name}</Link>
                          </div>
                        </div>
                      </td>
                      <td>
                        {product.datebegin}
                        <br />
                        {product.dateend}
                      </td>

                      <td>
                        <button
                          onClick={() => handleStatus(product.id)}
                          className={
                            product.status === 1
                              ? " bg-light border-0 px-1 text-success"
                              : "bg-light border-0 px-1 text-danger"
                          }
                        >
                          {product.status === 1 ? (
                            <FaToggleOn />
                          ) : (
                            <FaToggleOff />
                          )}
                        </button>
                      </td>
                      <td>
                        <div>
                          <div>
                            {/* Button trigger modal */}
                            <button
                              type="button"
                              className="btn btn-link"
                              data-bs-toggle="modal"
                              data-bs-target={
                                "#staticBackdrop" + product.sale_id
                              }
                            >
                              Xóa
                            </button>
                            {/* Modal */}
                            <div
                              className="modal fade"
                              id={"staticBackdrop" + product.sale_id}
                              data-bs-backdrop="static"
                              data-bs-keyboard="false"
                              tabIndex={-1}
                              aria-labelledby={
                                "staticBackdropLabel" + product.sale_id
                              }
                              aria-hidden="true"
                            >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h1
                                      className="modal-title fs-5"
                                      id={
                                        "staticBackdropLabel" + product.sale_id
                                      }
                                    >
                                      Xóa chương trình khuyến mãi của sản phẩm
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
                                      Bạn có chắc chắn muốn xóa Chương trình
                                      khuyến mãi của sản phẩm?
                                    </p>
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
                                      id={"buttonDelete" + product.sale_id}
                                      className="btn btn-danger "
                                      data-bs-dismiss="modal"
                                      onClick={() =>
                                        handleDelete(product.sale_id)
                                      }
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Advertisement;
