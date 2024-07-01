import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import CategoryService from "../../../service/CategoryService";
import { Link } from "react-router-dom";
import { urlImage } from "../../../config";
import AdvertisingCampaignService from "../../../service/AdvertisingCampaignsService";

const CreateAdvertisement = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const sellerId = localStorage.getItem("userId");
  const [load, setLoad] = useState(Date.now());
  const [categories, setCategories] = useState([]);
  const [productSelect, setProductSelect] = useState([]);
  const [keyword, setKeyWord] = useState("");
  const [budget, setBudget] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bid_price, setBidPrice] = useState("");
  useEffect(() => {
    (async () => {
      if (sellerId !== null) {
        const result = await ProductService.productsellerid(sellerId);
        const productActive = result.data.filter(
          (product) => product.status === 1 && product.stockquantity >= 1
        );
        setProducts(productActive);
        const categoryResult = await CategoryService.getList();
        setCategories(categoryResult.data);
      }
    })();
  }, [load, productSelect, productId]);
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleSelectProduct = async () => {
    try {
      const selectedProductId = document.querySelector(
        "input[name='productSelection']:checked"
      );
      if (selectedProductId) {
        const result = await ProductService.getById(selectedProductId.value);
        const productData = result.data;
        setProductSelect(productData); // Cập nhật thông tin sản phẩm được chọn
        setProductId(productData.id);
        console.log(productId); // Cập nhật ID của sản phẩm được chọn
      } else {
        console.error("Không có sản phẩm nào được chọn.");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý sản phẩm:", error);
    }
  };
  function formatDateToDatabaseFormat(date) {
    // Kiểm tra xem date có phải là đối tượng Date không
    if (!(date instanceof Date)) {
      throw new Error("Input must be a Date object");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Thêm số 0 vào trước nếu cần
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }
  const handleSave = async () => {
    try {
      var addAdvertisement = new FormData();
      addAdvertisement.append("product_id", productId);
      addAdvertisement.append("budget", budget);
      addAdvertisement.append("bid_price", bid_price);
      addAdvertisement.append("keyword", keyword);
      addAdvertisement.append(
        "start_date",
        formatDateToDatabaseFormat(new Date(startTime))
      );
      addAdvertisement.append(
        "end_date",
        formatDateToDatabaseFormat(new Date(endTime))
      );
      addAdvertisement.append("status", 1);
      (async () => {
        const resultAdvertisement =
          await AdvertisingCampaignService.addAd_Campaign(addAdvertisement);
        console.log(resultAdvertisement);
        if (resultAdvertisement.status === 201) {
          var addAd_Performance = new FormData();
          const currentDate = new Date();
          const formattedDate = currentDate
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          addAd_Performance.append(
            "ad_campaign_id",
            resultAdvertisement.data.id
          );
          addAd_Performance.append("date", formattedDate);
          addAd_Performance.append("clicks", 0);
          addAd_Performance.append("purchases", 0);
          addAd_Performance.append("views", 0);
          (async () => {
            const resultAdvertisement =
              await AdvertisingCampaignService.addAd_Performance(
                addAd_Performance
              );
          })();
          setProductId("");
          setBudget("");
          setBidPrice("");
          setKeyWord("");
          setStartTime("");
          setEndTime("");
          setProductSelect("");
        }
      })();
    } catch (error) {
      console.error("Lỗi khi xử lý sản phẩm:", error);
    }
  };

  return (
    <div>
      <h4 className="d-inline-flex p-2">Tạo Quảng cáo Tìm Kiếm</h4>

      <div className="row border rounded-2 mt-4 f6f6f6 ">
        <h4 className="mt-4 ">Thiết lập Cơ Bản</h4>
        <div class="d-flex flex-column " style={{ marginLeft: 100 }}>
          <div class="p-2 d-flex flex-row ">
            {" "}
            <div class="p-2 d-flex align-items-center">Ngân sách</div>
            <div class="p-2 d-flex align-items-center">
              <input
                type="number"
                className="form-control border d-inline-block"
                id="exampleFormControlInput1"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min={5000}
                defaultValue="5000"
                style={{
                  outline: "none",
                  boxShadow: "none",
                  marginLeft: 7,
                  fontSize: 14,
                  width: 293,
                }}
              />
            </div>
          </div>
          <div class="p-2 d-flex flex-row ">
            {" "}
            <div
              class="p-2 d-flex align-items-center"
              style={{ marginLeft: -44 }}
            >
              Thời gian áp dụng
            </div>
            <div class="p-2 d-flex align-items-center">
              <input
                type="date"
                className="form-control border"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                id="colFormLabel"
                style={{
                  outline: "none",
                  boxShadow: "none",
                  width: 200,
                  marginLeft: 7,
                }}
              />
              <span className="ms-3 me-3">-</span>
              <input
                type="date"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="form-control border"
                id="colFormLabel"
                style={{ outline: "none", boxShadow: "none", width: 200 }}
              />
            </div>
          </div>
        </div>
        <h4 className="mt-4 ">Thiết lập Sản Phẩm</h4>
        <div class="d-flex flex-column " style={{ marginLeft: 100 }}>
          <div class="p-2 d-flex flex-row ">
            {" "}
            <div class="p-2 d-flex align-items-center">Sản phẩm</div>
            <div class="p-2 d-flex align-items-center">
              <button
                type="button"
                className="btn btn-danger"
                style={{ fontSize: 14, width: 230, marginLeft: 11 }}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                Chọn sản phẩm
              </button>
              <div
                className="modal fade"
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-xl">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1
                        class="modal-title fs-5"
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
                      <div class="d-flex flex-row mb-3">
                        <div class="p-2">Ngành hàng</div>
                        <div class="p-2">
                          <select
                            class="form-select border small"
                            aria-label="Default select example"
                            style={{
                              outline: "none",
                              boxShadow: "none",
                              width: 214,
                              fontSize: 14,
                            }}
                          >
                            <option selected>Tất cả ngành hàng</option>
                            <option value="1">One</option>
                          </select>
                        </div>
                        <div class="p-2 mt-1"></div>
                        <div class="p-2 mt-1 ms-4">
                          <p>Tìm</p>
                        </div>
                        <div class="p-2">
                          <select
                            class="form-select border small"
                            aria-label="Default select example"
                            style={{
                              outline: "none",
                              boxShadow: "none",
                              width: 190,
                              fontSize: 14,
                            }}
                          >
                            <option selected>Tên sản phẩm</option>
                            <option value="1">Mã sản phẩm</option>
                          </select>
                        </div>
                        <div class="p-2">
                          <input
                            type="email"
                            class="form-control border"
                            id="exampleFormControlInput1"
                            style={{
                              outline: "none",
                              boxShadow: "none",
                              width: 214,
                              fontSize: 14,
                              marginLeft: -10,
                            }}
                            placeholder="Tối đa"
                          />
                        </div>
                      </div>
                      <div class="d-flex flex-row mb-3">
                        <div class="p-2">
                          <button
                            type="button"
                            style={{ fontSize: 14 }}
                            class="btn btn-outline-danger mb-4"
                          >
                            Tìm
                          </button>
                        </div>
                        <div class="p-2">
                          <button
                            type="button"
                            style={{ fontSize: 14 }}
                            class="btn btn-outline-dark mb-4"
                          >
                            Nhập lại
                          </button>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12">
                          <table class="table mb-5">
                            <thead class="">
                              <tr class="table-secondary">
                                <th scope="col"></th>
                                <th scope="col" style={{ width: 400 }}>
                                  Sản phẩm
                                </th>
                                <th scope="col">Giá</th>
                                <th scope="col">Loại hàng</th>
                                <th scope="col">Kho hàng</th>
                              </tr>
                            </thead>
                            <tbody>
                              {" "}
                              {products.map((product) => (
                                <tr>
                                  <td>
                                    {" "}
                                    <input
                                      type="radio"
                                      className="productId"
                                      value={product.id}
                                      id={"productId" + product.id}
                                      name="productSelection"
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
                                  <td>{formatPrice(product.price)}</td>
                                  <td>
                                    {" "}
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
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Đóng
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                        onClick={() => handleSelectProduct()}
                      >
                        Chọn sản phẩm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {productSelect.length !== 0 ? (
            <table
              className="table mb-5 mt-3"
              style={{ width: 800, marginLeft: 105 }}
            >
              <thead className="table-secondary">
                <tr>
                  <th scope="col"></th>
                  <th scope="col" style={{ width: 300 }}>
                    Sản phẩm
                  </th>
                  <th scope="col">Giá</th>
                  <th scope="col">Loại hàng</th>
                  <th scope="col">Kho hàng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>
                    <div className="d-flex flex-row mb-3">
                      <div className="p-2">
                        <img
                          className="img-fluid"
                          style={{ width: 114 }}
                          src={urlImage + "product/" + productSelect.image}
                          alt="product.jpg"
                        />
                      </div>
                      <div className="p-2">
                        <Link>{productSelect.name}</Link>
                      </div>
                    </div>
                  </td>
                  <td>{formatPrice(parseInt(productSelect.price))}</td>
                  <td>
                    {(() => {
                      const category = categories.find(
                        (cat) => cat.id === productSelect.category_id
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
                  <td>{productSelect.stockquantity}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            ""
          )}

          <div class="p-2 d-flex flex-row ">
            {" "}
            <div
              class="p-2 d-flex align-items-center"
              style={{ marginLeft: 12 }}
            >
              Từ khóa
            </div>
            <div class="p-2 d-flex align-items-center">
              <button
                type="button"
                className="btn btn-danger"
                style={{ fontSize: 14, width: 230, marginLeft: 11 }}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdropKeyWord"
              >
                Thêm từ khóa
              </button>
              <div
                className="modal fade"
                id="staticBackdropKeyWord"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-labelledby="staticBackdropKeyWordLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1
                        class="modal-title fs-5"
                        id="exampleModalToggleLabel2"
                      >
                        Thêm từ khóa
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <div className="modal-body">
                      <div class="row">
                        <div class="col-md-12">
                          <table
                            class="table mb-5"
                            style={{ borderBottom: "none" }}
                          >
                            <thead class="">
                              <tr class="table-secondary">
                                <th scope="col"></th>
                                <th scope="col">Từ khóa</th>
                                <th scope="col">Giá thầu</th>
                              </tr>
                            </thead>
                            <tbody>
                              {" "}
                              <tr>
                                <td> </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control border d-inline-block "
                                    value={keyword}
                                    onChange={(e) => setKeyWord(e.target.value)}
                                    id="exampleFormControlInput1"
                                    style={{
                                      outline: "none",
                                      boxShadow: "none",
                                      fontSize: 14,
                                    }}
                                  />
                                </td>

                                <td>
                                  <input
                                    type="number"
                                    className="form-control border d-inline-block"
                                    id="exampleFormControlInput1"
                                    value={bid_price}
                                    onChange={(e) =>
                                      setBidPrice(e.target.value)
                                    }
                                    min={5000}
                                    defaultValue="5000"
                                    style={{
                                      outline: "none",
                                      boxShadow: "none",
                                      fontSize: 14,
                                    }}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Đóng
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                      >
                        Chọn sản phẩm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {keyword.length === 0 || bid_price.length === 0 ? (
            ""
          ) : (
            <table
              class="table mb-5 mt-3"
              style={{ width: 500, marginLeft: 105 }}
            >
              <thead class="">
                <tr class="table-secondary">
                  <th scope="col"></th>
                  <th scope="col" style={{ width: 200 }}>
                    Từ khóa
                  </th>

                  <th scope="col">Giá đấu thầu</th>
                </tr>
              </thead>
              <tbody>
                {" "}
                <tr>
                  <td></td>
                  <td>{keyword}</td>
                  <td>{bid_price}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div class="d-flex flex-row-reverse">
        <div class="p-2">
          <button
            onClick={() => handleSave()}
            className="btn btn-danger btn-sm  "
          >
            Thiết Lập
          </button>
        </div>
        <div class="p-2">
          <Link
            to="/seller/marketing/advertisement"
            className="btn btn-info btn-sm ms-2  text-white"
          >
            Trở về
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAdvertisement;
