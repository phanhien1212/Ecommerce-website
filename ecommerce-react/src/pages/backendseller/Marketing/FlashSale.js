import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import { urlImage } from "../../../config";
import { Link } from "react-router-dom";
import CategoryService from "../../../service/CategoryService";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

const FlashSale = () => {
  const [products, setProducts] = useState([]);
  const [productFlashSale, setProductFlashSale] = useState([]);
  const [productSelect, setProductSelect] = useState([]);
  const sellerId = localStorage.getItem("userId");
  const [categories, setCategories] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    (async () => {
      const result = await ProductService.productsellerid(sellerId);
      const productActive = result.data.filter(
        (product) => product.status === 1 && product.stockquantity >= 1
      );
      setProducts(productActive);
      const resultFlashSale = await ProductService.getflashsalebyseller(
        sellerId
      );
      setProductFlashSale(resultFlashSale.data);
      const categoryResult = await CategoryService.getList();
      setCategories(categoryResult.data);
    })();
  }, [load, productFlashSale]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const [selectedDate, setSelectedDate] = useState(""); // State để lưu trữ ngày được chọn

  const handleRadioChange = (event) => {
    if (event.target.checked) {
      const value = event.target.value;
      const [start, end] = value.split(" - ");
      setStartTime(start);
      setEndTime(end);
    }
  };
  function compareCurrentTime(startTimeString, endTimeString) {
    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);
    const currentTime = new Date();

    if (currentTime >= startTime && currentTime <= endTime) {
      return 1; // Thời gian hiện tại nằm trong khoảng thời gian bắt đầu và kết thúc
    } else if (currentTime > endTime) {
      return 2; // Thời gian hiện tại sau thời gian kết thúc
    } else if (currentTime < startTime) {
      return 3; // Thời gian hiện tại trước thời gian bắt đầu
    }
  }

  const handleStatus = async (id) => {
    try {
      await ProductService.updatestatusflashsale(id);
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
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Không có";
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
  const handleDelete = async (id) => {
    try {
      await ProductService.deleteflashsale(id);
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
  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    // Trích xuất các thành phần ngày giờ từ đối tượng Date
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    // Định dạng đầu ra theo dạng "HH:MM:SS DD-MM-YYYY"
    const formattedDateTime = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;

    return formattedDateTime;
  }
  const handleAddFlashSale = async () => {
    try {
      // Lặp qua mảng productSelect để thêm flash sale cho mỗi sản phẩm
      for (const product of productSelect) {
        try {
          const discountproduct = document.getElementById(
            `discount` + product.id
          ).value;
          const discountedPrice = (
            (parseFloat(discountproduct) / 100) *
            product.price
          ).toFixed(2);
          const pricesale = product.price - discountedPrice;

          var addFlashSale = new FormData();
          addFlashSale.append("priceSale", parseFloat(pricesale));
          addFlashSale.append("discount", parseFloat(discountproduct));
          addFlashSale.append("startTime", selectedDate + " " + startTime);
          addFlashSale.append("endTime", selectedDate + " " + endTime);
          addFlashSale.append("status", 1);
          addFlashSale.append("productId", product.id);
          const result = await ProductService.addflashsale(addFlashSale);
          // Thực hiện các hoạt động khác ở đây, ví dụ: gửi dữ liệu đến cơ sở dữ liệu
        } catch (error) {
          console.error("Lỗi lấy thông tin sản phẩm:", error);
        }
      }
      alert("Thêm flashsale mới thành công");
    } catch (error) {
      console.error("Lỗi khi xử lý sản phẩm:", error);
    }
  };

  console.log(productSelect);
  return (
    <div>
      <div className="row border rounded-2 f6f6f6 ">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-7">
              <h5 className="mt-3 ms-2">Danh sách chương trình</h5>
              <p className="mt-3 ms-2 colorgray small">
                Chạy chương trình Flash Sale của riêng Shop để tăng doanh số!
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
                            Chương trình Flash Sale của Shop
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
                          <div className="row ms-1">
                            <label
                              htmlFor="colFormLabel"
                              className="col-sm-1 col-form-label"
                            >
                              Ngày
                            </label>
                            <div className="col-sm-11">
                              <input
                                type="date"
                                style={{
                                  outline: "none",
                                  boxShadow: "none",
                                  width: 200,
                                }}
                                className="form-control border ms-4"
                                id="colFormLabel"
                                value={selectedDate}
                                onChange={(e) =>
                                  setSelectedDate(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="row mb-3 mt-2 ms-1">
                            <div className="row">
                              <div className="col-md-7 row">
                                <label
                                  htmlFor="colFormLabel"
                                  className="col-sm-2 col-form-label"
                                >
                                  Khung giờ
                                </label>
                                <div className="col-sm-4 mt-1">
                                  <div className="d-flex flex-row">
                                    <div
                                      className="p-2 ms-2"
                                      style={{ width: 200 }}
                                    >
                                      <input
                                        type="radio"
                                        className="btn-check "
                                        style={{ width: 200 }}
                                        name="options-outlined"
                                        id="danger-outlined1"
                                        autoComplete="off"
                                        value="00:00:00 - 01:59:59"
                                        onChange={handleRadioChange}
                                      />
                                      <label
                                        className="btn btn-outline-danger "
                                        style={{ width: 200 }}
                                        htmlFor="danger-outlined1"
                                      >
                                        00:00:00 - 01:59:59
                                      </label>
                                      <input
                                        type="radio"
                                        className="btn-check "
                                        style={{ width: 200 }}
                                        name="options-outlined"
                                        id="danger-outlined2"
                                        value=" 02:00:00 - 08:59:59"
                                        onChange={handleRadioChange}
                                        autoComplete="off"
                                      />
                                      <label
                                        className="btn btn-outline-danger mt-2"
                                        style={{ width: 200 }}
                                        htmlFor="danger-outlined2"
                                      >
                                        02:00:00 - 08:59:59
                                      </label>
                                      <input
                                        type="radio"
                                        className="btn-check "
                                        style={{ width: 200 }}
                                        name="options-outlined"
                                        id="danger-outlined3"
                                        autoComplete="off"
                                        value="09:00:00 - 11:59:59"
                                        onChange={handleRadioChange}
                                      />
                                      <label
                                        className="btn btn-outline-danger mt-2"
                                        style={{ width: 200 }}
                                        htmlFor="danger-outlined3"
                                      >
                                        09:00:00 - 11:59:59
                                      </label>
                                      <input
                                        type="radio"
                                        className="btn-check "
                                        style={{ width: 200 }}
                                        name="options-outlined"
                                        id="danger-outlined4"
                                        autoComplete="off"
                                        value="12:00:00 - 14:59:59"
                                        onChange={handleRadioChange}
                                      />
                                      <label
                                        className="btn btn-outline-danger mt-2"
                                        style={{ width: 200 }}
                                        htmlFor="danger-outlined4"
                                      >
                                        12:00:00 - 14:59:59
                                      </label>
                                    </div>
                                    <div
                                      className="p-2 ms-5"
                                      style={{ width: 200 }}
                                    >
                                      <input
                                        type="radio"
                                        className="btn-check "
                                        style={{ width: 200 }}
                                        name="options-outlined"
                                        id="danger-outlined5"
                                        autoComplete="off"
                                        value="15:00:00 - 16:59:59"
                                        onChange={handleRadioChange}
                                      />
                                      <label
                                        className="btn btn-outline-danger"
                                        style={{ width: 200 }}
                                        htmlFor="danger-outlined5"
                                      >
                                        15:00:00 - 16:59:59
                                      </label>
                                      <input
                                        type="radio"
                                        className="btn-check "
                                        style={{ width: 200 }}
                                        name="options-outlined"
                                        id="danger-outlined6"
                                        autoComplete="off"
                                        value="17:00:00 - 18:59:59"
                                        onChange={handleRadioChange}
                                      />
                                      <label
                                        className="btn btn-outline-danger mt-2"
                                        style={{ width: 200 }}
                                        htmlFor="danger-outlined6"
                                      >
                                        17:00:00 - 18:59:59
                                      </label>
                                      <input
                                        type="radio"
                                        className="btn-check "
                                        style={{ width: 200 }}
                                        name="options-outlined"
                                        id="danger-outlined7"
                                        autoComplete="off"
                                        value="19:00:00 - 20:59:59"
                                        onChange={handleRadioChange}
                                      />
                                      <label
                                        className="btn btn-outline-danger mt-2"
                                        style={{ width: 200 }}
                                        htmlFor="danger-outlined7"
                                      >
                                        19:00:00 - 20:59:59
                                      </label>
                                      <input
                                        type="radio"
                                        className="btn-check "
                                        style={{ width: 200 }}
                                        name="options-outlined"
                                        id="danger-outlined8"
                                        autoComplete="off"
                                        value="21:00:00 - 23:59:59"
                                        onChange={handleRadioChange}
                                      />
                                      <label
                                        className="btn btn-outline-danger mt-2"
                                        style={{ width: 200 }}
                                        htmlFor="danger-outlined8"
                                      >
                                        21:00:00 - 23:59:59
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-5" />
                            </div>
                          </div>
                          <div className="row">
                            <h5 className="mt-">
                              Sản phẩm tham gia Flash Sale của Shop
                            </h5>
                            <p className="small ms-2 colorgray">
                              Vui lòng kiểm tra tiêu chí sản phẩm trước khi thêm
                              sản phẩm vào chương trình khuyến mãi của bạn.
                            </p>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <table className="table mb-5">
                                <thead className>
                                  <tr className="table-secondary">
                                    <th scope="col" style={{ width: 300 }}>
                                      Sản phẩm
                                    </th>
                                    <th scope="col">Giá gốc</th>
                                    <th scope="col">Khuyến mãi (%)</th>

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
                            onClick={() => handleAddFlashSale()}
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
                        <div className="modal-body">
                          <div className="row">
                            <div className="col-md-12">
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
                            data-bs-toggle="modal"
                            onClick={() => handleSelectProduct()}
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
          </div>
          <div className="d-flex flex-row mx-auto">
            <div className="p-2 me-3 my-auto">
              <Link to="" className="colorshopee fw-bold">
                Tất cả
              </Link>
            </div>
            <div className="p-2 me-3 my-auto">
              <Link to="">Đang diễn ra</Link>
            </div>
            <div className="p-2 me-3 my-auto">
              <Link to="">Sắp diễn ra </Link>
            </div>
            <div className="p-2 me-3 my-auto">
              <Link className to="">
                Đã kết thúc{" "}
              </Link>
            </div>
          </div>
          <div className="mt-3 row">
            <p className="mt-3 ms-2 colorgray">
              Có tất cả{" "}
              <b style={{ color: "black" }}>{productFlashSale.length}</b> Flash
              Sale của shop
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <table
          className="table mb-5 mt-2"
          style={{ width: 1224.4, marginLeft: -11 }}
        >
          <thead className>
            <tr className="table-secondary">
              <th scope="col">Khung giờ</th>
              <th scope="col" style={{ width: 400 }}>
                Sản phẩm
              </th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Bật/Tắt</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {productFlashSale.map((product) => (
              <tr>
                <td>
                  <p>
                    {formatDateTime(product.start_time)} - <br />
                    {formatDateTime(product.end_time)}
                  </p>
                </td>

                <td>
                  <div class="d-flex flex-row mb-3">
                    <div class="p-2">
                      {" "}
                      <img
                        className="img-fluid"
                        style={{ width: 114 }}
                        src={urlImage + "product/" + product.product_image}
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
                  {compareCurrentTime(product.start_time, product.end_time) ===
                  1
                    ? "Đang diễn ra"
                    : compareCurrentTime(
                        product.start_time,
                        product.end_time
                      ) === 2
                    ? "Đã kết thúc"
                    : "Sắp diễn ra"}
                </td>

                <td>
                  <button
                    onClick={() => handleStatus(product.flashsale_id)}
                    className={
                      product.status === 1
                        ? " bg-light border-0 px-1 text-success"
                        : "bg-light border-0 px-1 text-danger"
                    }
                  >
                    {product.status === 1 ? <FaToggleOn /> : <FaToggleOff />}
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
                          "#staticBackdrop" + product.flashsale_id
                        }
                      >
                        Xóa
                      </button>
                      {/* Modal */}
                      <div
                        className="modal fade"
                        id={"staticBackdrop" + product.flashsale_id}
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex={-1}
                        aria-labelledby={
                          "staticBackdropLabel" + product.flashsale_id
                        }
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id={
                                  "staticBackdropLabel" + product.flashsale_id
                                }
                              >
                                Xóa chương trình FlashSale của sản phẩm
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
                                Bạn có chắc chắn muốn xóa Chương trình Flash
                                Sale của sản phẩm?
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
                                id={"buttonDelete" + product.flashsale_id}
                                className="btn btn-danger "
                                data-bs-dismiss="modal"
                                onClick={() =>
                                  handleDelete(product.flashsale_id)
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
  );
};

export default FlashSale;
