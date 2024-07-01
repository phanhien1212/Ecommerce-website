import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryService from "../../../service/CategoryService";
import ProductService from "../../../service/ProductService";
import { urlImage } from "../../../config";

const EditProductSeller = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({});
  const sellerId = localStorage.getItem("userId");
  const [category_id, setCategory_id] = useState("");
  const navigate = useNavigate();
  const [subCategory_id, setSubCategory_id] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [detail, setDetail] = useState("");
  const [description, setDescription] = useState("");
  const [updated_by, setUpdated_By] = useState(sellerId);
  const [seller_id, setSellerId] = useState(sellerId);
  const [stockquantity, setStockquantity] = useState("");
  const [attribute_name1, setAttributeName1] = useState("");
  const [attribute_name2, setAttributeName2] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [attribute, setAttribute] = useState({});
  const [attribute_value1, setAttributeValue1] = useState("");
  const [attribute_value2, setAttributeValue2] = useState("");
  const fileInputRef = useRef(null); // Tạo một đối tượng ref

  useEffect(() => {
    (async () => {
      const result = await CategoryService.getList();
      setCategories(result.data);
      const resultProduct = await ProductService.getById(id);
      setProduct(resultProduct.data);
      setName(resultProduct.data.name);
      setPrice(resultProduct.data.price);
      setCategory_id(resultProduct.data.category_id);
      setDetail(resultProduct.data.detail);
      setImage(resultProduct.data.image);
      setDescription(resultProduct.data.description);
      setImageUrl(`${urlImage}product/${resultProduct.data.image}`);
      setStockquantity(resultProduct.data.stockquantity);

      const resultCategory = await CategoryService.getById(
        resultProduct.data.category_id
      );
      const resultAttribute = await ProductService.getattribute(id);
      setAttribute(resultAttribute.data);
      setAttributeName1(resultAttribute.data.attribute_name1);
      setAttributeName2(resultAttribute.data.attribute_name2);
      setAttributeValue1(resultAttribute.data.attribute_value1);
      setAttributeValue2(resultAttribute.data.attribute_value2);
    })();
  }, []);

  //Lưu và Hiện
  const handleSaveAndDisplay = (event) => {
    event.preventDefault();
    var image = document.getElementById("image");
    var addProduct = new FormData();
    addProduct.append("name", name);
    if (subCategory_id !== "") {
      addProduct.append("category_id", subCategory_id);
    } else {
      addProduct.append("category_id", category_id);
    }
    addProduct.append("updated_by", updated_by);
    addProduct.append("price", price);
    addProduct.append("detail", detail);
    addProduct.append("seller_id", seller_id);
    addProduct.append("stockquantity", stockquantity);
    addProduct.append("description", description);
    addProduct.append("status", 0);
    addProduct.append("image", image.files.length === 0 ? "" : image.files[0]);
    (async () => {
      const resultProduct = await ProductService.updateproduct(id, addProduct);

      if (resultProduct.status === 201) {
        const productId = resultProduct.data.id;
        var addAttribute = new FormData();
        addAttribute.append("attribute_name1", attribute_name1);
        addAttribute.append("product_id", productId);
        addAttribute.append("attribute_name2", attribute_name2);
        addAttribute.append("attribute_value1", attribute_value1);
        addAttribute.append("attribute_value2", attribute_value2);
        const resultAttribute = await ProductService.updateproduct(
          attribute.data.id,
          addAttribute
        );
        if (resultAttribute.status === 201) {
          alert("Bạn đã sửa thành công");
        }
      }
    })();
  };
  //Lưu và Ẩn
  const handleSaveAndHidden = (event) => {
    event.preventDefault();
    var image = document.getElementById("image");
    var addProduct = new FormData();
    addProduct.append("name", name);
    if (subCategory_id !== "") {
      addProduct.append("category_id", subCategory_id);
    } else {
      addProduct.append("category_id", category_id);
    }
    addProduct.append("updated_by", updated_by);
    addProduct.append("price", price);
    addProduct.append("detail", detail);
    addProduct.append("seller_id", seller_id);
    addProduct.append("stockquantity", stockquantity);
    addProduct.append("description", description);
    addProduct.append("status", 2);
    addProduct.append("image", image.files.length === 0 ? "" : image.files[0]);
    (async () => {
      const resultProduct = await ProductService.updateproduct(id, addProduct);
      console.log(resultProduct);

      if (resultProduct.status === 201) {
        const productId = resultProduct.data.id;
        var addAttribute = new FormData();
        addAttribute.append("attribute_name1", attribute_name1);
        addAttribute.append("product_id", productId);
        addAttribute.append("attribute_name2", attribute_name2);
        addAttribute.append("attribute_value1", attribute_value1);
        addAttribute.append("attribute_value2", attribute_value2);
        const resultAttribute = await ProductService.updateproduct(
          attribute.data.id,
          addAttribute
        );
        if (resultAttribute.status === 201) {
          alert("Bạn đã sửa thành công");
        }
      }
    })();
  };
  //Cancel
  const handleCancel = (event) => {
    event.preventDefault();
    setImage("");
    setName("");
    setDescription("");
    setAttributeName1("");
    setAttributeName2("");
    setAttributeValue1("");
    setAttributeValue2("");
    setDetail("");
    setCategory_id("");
    setSubCategory_id("");
    setPrice("");
    setStockquantity("");
  };
  return (
    <div>
      <div className="d-flex p-2 row " style={{ height: 70 }}>
        <div className="col-md-12  mt-4">
          <div
            className="row mx-auto border rounded-2"
            style={{ backgroundColor: "#ffffff", width: 950 }}
          >
            <h4 className="mt-5 w-25 mx-auto">Thông tin cơ bản</h4>
            <div className="d-flex flex-column mb-3 ms-5">
              <div className="p-2 ">
                <span className="colorshopee">*</span> Hình ảnh sản phẩm
              </div>
              <div
                className="p-2 border rounded-2 ms-2 box-body "
                style={{ width: 836 }}
              >
                <input
                  type="file"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    setImage(selectedFile);
                    setImageUrl(URL.createObjectURL(selectedFile)); // Lấy đường dẫn ảnh từ đối tượng File
                  }}
                  id="image"
                  name="image"
                  className="form-control border"
                  style={{ outline: "none", boxShadow: "none" }}
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    className="mt-2"
                    alt="Product Image"
                    style={{ width: 150, height: 150 }}
                  />
                )}
              </div>
              <div className="p-2">
                <span className="colorshopee">*</span> Tên sản phẩm
              </div>
              <div className="p-2 " style={{ width: 852, height: 44 }}>
                <input
                  type="email"
                  className="form-control border d-inline-block"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="exampleFormControlInput1"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    fontSize: 14,
                    height: 44,
                  }}
                  placeholder="Nhập vào"
                />
              </div>

              <div className="p-2 mt-2">
                <span className="colorshopee">*</span> Ngành hàng
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div
                    className="p-2 "
                    name="DanhMucCha"
                    style={{ width: 402, height: 44 }}
                  >
                    <select
                    className="form-select border small"
                    aria-label="Default select example"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      fontSize: 14,
                      height: 44,
                      
                    }}
                    value={category_id}
                    onChange={(e) => setCategory_id(e.target.value)}
                    >
                      {categories.map((category, index) => {
                        if (category.parent_id === 0) {
                          // Tìm các danh mục con của danh mục cha hiện tại
                          const subCategories = categories.filter(
                            (subCategory) =>
                              subCategory.parent_id === category.id
                          );

                          // Render danh mục cha và danh mục con của nó
                          return (
                            <React.Fragment key={index}>
                              <option
                                style={{
                                  fontSize: 14,
                                  height: 44,
                                }}
                                value={category.id}
                              >
                                {category.name}
                              </option>
                              {subCategories.map((subCategory, subIndex) => (
                                <option
                                  key={`${index}-${subIndex}`}
                                  style={{
                                    fontSize: 14,
                                    height: 44,
                                    marginLeft: 10, // Thêm một khoảng cách cho danh mục con
                                  }}
                                  value={subCategory.id}
                                >
                                  --- {subCategory.name}
                                </option>
                              ))}
                            </React.Fragment>
                          );
                        }
                        return null;
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-2 mt-2">
                <span className="colorshopee mt-2">*</span> Mô tả sản phẩm
              </div>
              <div className="p-2 " style={{ width: 852 }}>
                <div className="form-floating">
                  <textarea
                    className="form-control border d-inline-block"
                    placeholder="Leave a comment here"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      fontSize: 14,
                      height: 200,
                    }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="floatingTextarea2"
                    defaultValue={""}
                  />
                  <label htmlFor="floatingTextarea2">0/3000</label>
                </div>
              </div>
              <div className="p-2 mt-2">
                <span className="colorshopee">*</span>Chi tiết sản phẩm
              </div>
              <div className="p-2 mb-5" style={{ width: 852 }}>
                <div className="form-floating">
                  <textarea
                    className="form-control border d-inline-block"
                    placeholder="Leave a comment here"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      fontSize: 14,
                      height: 100,
                    }}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    id="floatingTextarea2"
                    defaultValue={""}
                  />
                  <label htmlFor="floatingTextarea2">0/3000</label>
                </div>
              </div>
            </div>
          </div>
          {/* Thông tin bán hàng */}
          <div
            className="row mx-auto border rounded-2 mt-4"
            style={{ backgroundColor: "#ffffff", width: 950 }}
          >
            <h4 className="mt-5 w-25 mx-auto">Thông tin chi tiết</h4>
            <div className="d-flex flex-column mb-3 ms-5">
              <div className="p-2 ">
                <span className="colorshopee">*</span> Phân loại hàng
              </div>
              <div
                className="row "
                style={{
                  backgroundColor: "rgb(236, 239, 242)",
                  width: 850,
                  height: 90,
                }}
              >
                <div className="p-2 ms-3 small colorshopee"> Phân loại 1</div>

                <div className="col-md-6 mx-auto">
                  <input
                    type="email"
                    className="form-control border d-inline-block"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      marginLeft: 7,
                      fontSize: 14,
                      height: 36,
                      width: 293,
                    }}
                    value={attribute_name1}
                    onChange={(e) => setAttributeName1(e.target.value)}
                    placeholder="Tên thuộc tính"
                  />{" "}
                  <div />
                </div>
                <div className="col-md-6 ">
                  <input
                    type="email"
                    className="form-control border d-inline-block"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      fontSize: 14,
                      marginLeft: 7,
                      height: 36,
                      width: 293,
                      marginBottom: 50,
                    }}
                    value={attribute_value1}
                    onChange={(e) => setAttributeValue1(e.target.value)}
                    placeholder="Các thuộc tính cách nhau bởi dấu phẩy"
                  />{" "}
                  <div />
                </div>
              </div>
              <div
                className="row mt-4"
                style={{
                  backgroundColor: "rgb(236, 239, 242)",
                  width: 850,
                  height: 90,
                }}
              >
                <div className="p-2 ms-3 small colorshopee"> Phân loại 2</div>
                <div className="col-md-6 mx-auto">
                  <input
                    type="email"
                    className="form-control border d-inline-block"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      marginLeft: 7,
                      fontSize: 14,
                      height: 36,
                      width: 293,
                    }}
                    value={attribute_name2}
                    onChange={(e) => setAttributeName2(e.target.value)}
                    placeholder="Tên thuộc tính"
                  />{" "}
                  <div />
                </div>
                <div className="col-md-6 ">
                  <input
                    type="email"
                    className="form-control border d-inline-block"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      fontSize: 14,
                      marginLeft: 7,
                      height: 36,
                      width: 293,
                      marginBottom: 50,
                    }}
                    value={attribute_value2}
                    onChange={(e) => setAttributeValue2(e.target.value)}
                    placeholder="Các thuộc tính cách nhau bởi dấu phẩy"
                  />{" "}
                  <div />
                </div>
              </div>
              <div className="p-2">
                <span className="colorshopee">*</span> Thông tin khác
              </div>
              <div className="row " style={{ width: 850, height: 60 }}>
                <div className="col-md-6 mx-auto">
                  <input
                    type="number"
                    className="form-control border d-inline-block"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      marginLeft: 7,
                      fontSize: 14,
                      height: 36,
                      width: 293,
                      marginTop: 11,
                    }}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Giá"
                  />{" "}
                  <div />
                </div>
                <div className="col-md-6 ">
                  <input
                    type="number"
                    className="form-control border d-inline-block"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      fontSize: 14,
                      marginLeft: 7,
                      height: 36,
                      marginTop: 11,
                      width: 293,
                      marginBottom: 50,
                    }}
                    value={stockquantity}
                    onChange={(e) => setStockquantity(e.target.value)}
                    placeholder="Số lượng "
                  />{" "}
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="d-flex flex-row-reverse">
              <div className="p-2">
                <button
                  type="button"
                  style={{ fontSize: 14 }}
                  className="btn btn-danger mb-4 mt-2"
                  onClick={handleSaveAndDisplay}
                >
                  Lưu &amp; Hiển thị
                </button>
              </div>
              <div className="p-2">
                <div className="p-2">
                  <button
                    type="button"
                    style={{ fontSize: 14 }}
                    className="btn btn-outline-dark mb-4"
                    onClick={handleSaveAndHidden}
                  >
                    Lưu &amp; Ẩn
                  </button>
                </div>
              </div>
              <div className="p-2">
                <div className="p-2">
                  <button
                    type="button"
                    style={{ fontSize: 14 }}
                    className="btn btn-outline-dark mb-4 ms-2"
                    onClick={handleCancel}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4" />
        </div>
      </div>
    </div>
  );
};

export default EditProductSeller;
