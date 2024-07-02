import { useEffect, useState, React } from "react";
import CategoryService from "../../../service/CategoryService";
import ProductService from "../../../service/ProductService";
import UserService from "../../../service/UserService";
import NotificationService from "../../../service/NotificationService";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const CreateProductSeller = () => {
  const [categories, setCategories] = useState([]);
  const sellerId = localStorage.getItem("userId");
  const [load, setLoad] = useState(Date.now());
  const [category_id, setCategory_id] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [subCategory_id, setSubCategory_id] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [detail, setDetail] = useState("");
  const [description, setDescription] = useState("");
  const [created_by, setCreatedBy] = useState(sellerId);
  const [selectedImage, setSelectedImage] = useState(null);
  const [seller_id, setSellerId] = useState(sellerId);
  const [stockquantity, setStockquantity] = useState("");
  const [attribute_name1, setAttributeName1] = useState("");
  const [attribute_name2, setAttributeName2] = useState("");
  const navigate = useNavigate();
  const [product_id, setProductId] = useState("");
  const [attribute_value1, setAttributeValue1] = useState("");
  const [attribute_value2, setAttributeValue2] = useState("");
  useEffect(() => {
    (async () => {
      const result = await CategoryService.getList();
      setCategories(result.data);
      const resultUser = await UserService.getById(sellerId);
      setUser(resultUser.data);
      const resultUsers = await UserService.getUsers();
      const userAdmins = resultUsers.data.filter((u) => u.role === "admin");
      setUsers(userAdmins);
    })();
  }, [categories]);

  //Lưu và Hiện
  const handleSaveAndDisplay = async (event) => {
    event.preventDefault();

    try {
      const image = document.getElementById("imageFeedback");
      var addProduct = new FormData();

      addProduct.append("name", name);
      addProduct.append(
        "category_id",
        subCategory_id !== "" ? subCategory_id : category_id
      );
      addProduct.append("description", description);
      addProduct.append("created_by", created_by);
      addProduct.append("price", price);
      addProduct.append("detail", detail);
      addProduct.append("seller_id", seller_id);
      addProduct.append("stockquantity", stockquantity);
      addProduct.append("status", 1);
      addProduct.append(
        "image",
        files[0]
      );

      
      try {
        const resultProduct = await ProductService.addproduct(addProduct);
        console.log(resultProduct);
        const productId = resultProduct.data.id;
        for (let i = 0; i < files.length; i++) {
          const productimageData = new FormData();
          productimageData.append('product_id',productId); // Replace with actual product_id
          productimageData.append('image', files[i]);
          const resultimageproduct = await ProductService.addproductimage(
            productimageData
          );
        }
       
        if (resultProduct.status === 201) {
         
          var addAttribute = new FormData();
          addAttribute.append("attribute_name1", attribute_name1);
          addAttribute.append("product_id", productId);
          addAttribute.append("attribute_name2", attribute_name2);
          addAttribute.append("attribute_value1", attribute_value1);
          addAttribute.append("attribute_value2", attribute_value2);

          const resultAttribute = await ProductService.addattribute(
            addAttribute
          );

          if (resultAttribute.status === 201) {
            var addScore = new FormData();
            addScore.append("product_id", productId);
            let category_id = 0;

            const category = categories.find(
              (cat) => cat.id === resultProduct.data.category_id
            );

            console.log("category:", category);

            if (category) {
              category_id =
                category.parent_id !== 0
                  ? category.parent_id
                  : category.category_id;
            }

            addScore.append("category_id", category_id);
            addScore.append("score", 0);

            const resultScore = await ProductService.addproductscore(addScore);

            if (resultScore.status === 201) {
              for (const u of users) {
                const addNotification = new FormData();
                addNotification.append(
                  "content",
                  `Nhà bán hàng ${user.username} vừa thêm 1 sản phẩm mới, kiểm tra NGAY`
                );
                addNotification.append(
                  "title",
                  `Bạn có 1 sản phẩm cần xác nhận`
                );
                addNotification.append("recipient_id", u.id);
                addNotification.append("status", 1);
                addNotification.append("link", `/admin/product/${productId}`);
                addNotification.append("role", `admin`);

                try {
                  const resultNotification =
                    await NotificationService.addNotification(addNotification);
                  console.log(
                    `Notification sent to user ${user.id}`,
                    resultNotification
                  );
                } catch (error) {
                  console.error(
                    `Error sending notification to user ${user.id}`,
                    error
                  );
                }
              }
              toast.success("Thêm sản phẩm mới thành công");
              setImage("");
              setSelectedImage("");
              setDescription("");
              setAttributeName1("");
              setName("");
              setAttributeName2("");
              setAttributeValue1("");
              setAttributeValue2("");
              setDetail("");
              setCategory_id("");
              setSubCategory_id("");
              setPrice("");
              setStockquantity("");
            } else {
              toast.error("Thêm điểm sản phẩm thất bại!");
            }
          } else {
            toast.error("Thêm thuộc tính sản phẩm thất bại!");
          }
        } else {
          toast.error("Thêm sản phẩm thất bại!");
        }
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Hãy nhập đầy đủ thông tin!");
      }
    } catch (error) {
      console.error("Form validation error:", error);
      toast.error("Hãy nhập đầy đủ thông tin!");
    }
  };

  //Lưu và Ẩn

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
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setCategory_id(selectedCategoryId);

    const filteredSubCategories = categories.filter(
      (category) => category.parent_id === parseInt(selectedCategoryId)
    );
    setSubCategories(filteredSubCategories);
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setSubCategory_id(selectedSubCategoryId);
    console.log("Selected Subcategory ID:", selectedSubCategoryId);
  };

  const [files, setFiles] = useState([]);
  const handleImage = (e) => {
    const uploadfiles = e.target.files;
    console.log("upload:", uploadfiles);
    setFiles(uploadfiles);

  };




  return (
    <>
      <ToastContainer />
      <div>
        <div className="d-flex p-2 row " style={{ height: 70 }}>
          <div className="col-md-12  mt-4">
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
                <Link
                  to={"/seller/productseller/" + sellerId}
                  style={{ fontSize: 14 }}
                  className="btn btn-info mb-4 mt-2 text-light"
                >
                  Quay lại trang chủ
                </Link>
              </div>
            </div>
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
                  className="Y5ceMw ms-3"
                  style={{ width: 836, height: 100 }}
                >
                 
                 {[...files].map((f) => (
                  <div>
                    <img
                      alt="not found"
                      width={"100px"}
                      className="me-3 z-2 "
                      src={URL.createObjectURL(f)}
                    />
                    <br />
                  </div>
                  ))}


                  <label className="Bpmgeo">
                    <svg width={20} height={18} viewBox="0 0 20 18" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.15377 9.76895C6.15377 11.8927 7.87492 13.6151 9.99992 13.6151C12.1236 13.6151 13.8461 11.8927 13.8461 9.76895C13.8461 7.6446 12.1236 5.9228 9.99992 5.9228C7.87492 5.9228 6.15377 7.6446 6.15377 9.76895ZM5 9.76896C5 7.00771 7.23813 4.76896 10 4.76896C12.7613 4.76896 15 7.00771 15 9.76896C15 12.5296 12.7613 14.769 10 14.769C7.23813 14.769 5 12.5296 5 9.76896ZM1.15385 17.2606C0.489784 17.2606 0 16.7249 0 16.0662V4.12218C0 3.46224 0.489784 2.8459 1.15385 2.8459H4.61538L5.21635 1.73267C5.21635 1.73267 5.75421 0.538208 6.41827 0.538208H13.5817C14.2452 0.538208 14.7837 1.73267 14.7837 1.73267L15.3846 2.8459H18.8462C19.5096 2.8459 20 3.46224 20 4.12218V16.0662C20 16.7249 19.5096 17.2606 18.8462 17.2606H1.15385Z"
                        fill="#EE4D2D"
                      ></path>
                    </svg>
                    <span className="BiwStw">Thêm Hình ảnh</span>
                    <input
                      className="mXvRBf"
                      type="file"
                     
                      name="myImage"
                      multiple
                      onChange={handleImage}
                      accept="image/*"
                    />
                  </label>
                  <div
                    className="_Y1LWz"
                    style={{
                      backgroundImage: 'url("")',
                      border: "none",
                    }}
                  />
                </div>
                <div style={{ color: "red" }}>
                  <span id="errorMessagesImage" className="ms-3 small"></span>
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
                <div
                  id="errorMessagesName"
                  className="mt-2"
                  style={{ color: "red" }}
                >
                  <span id="errorMessagesImage" className="ms-3  small"></span>
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
                        name="category_id"
                        value={category_id}
                        onChange={handleCategoryChange}
                      >
                        <option
                          selected
                          className="form-select-lg"
                          style={{
                            fontSize: 14,
                            height: 44,
                          }}
                          value=""
                        >
                          - - - - - Chọn ngành hàng - - - - -
                        </option>
                        {categories.map((category, index) => {
                          if (category.parent_id === 0) {
                            return (
                              <option
                                key={index}
                                style={{
                                  fontSize: 14,
                                  height: 44,
                                }}
                                value={category.id}
                              >
                                {category.name}
                              </option>
                            );
                          }
                          return null;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="p-2 "
                      name="DanhMucCon"
                      style={{ marginLeft: 75, width: 302, height: 44 }}
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
                        name="subcategory_id"
                        value={subCategory_id}
                        onChange={handleSubCategoryChange}
                      >
                        <option
                          selected
                          className="form-select-lg"
                          style={{
                            fontSize: 14,
                            height: 44,
                          }}
                          value=""
                        >
                          - - - - - Chọn danh mục con - - - - -
                        </option>
                        {subCategories.map((subcategory, index) => (
                          <option
                            key={index}
                            style={{
                              fontSize: 14,
                              height: 44,
                            }}
                            value={subcategory.id}
                          >
                            {subcategory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-2" style={{ color: "red" }}>
                  <span
                    id="errorMessagesCategory"
                    className="ms-3  small"
                  ></span>
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
                <div
                  id="errorMessagesDescription"
                  className=""
                  style={{ color: "red" }}
                ></div>
                <div className="p-2 mt-2">
                  <span className="colorshopee">*</span>Chi tiết sản phẩm
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
                <div
                  id="errorMessagesDetail"
                  className=""
                  style={{ color: "red" }}
                ></div>
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
                          className="btn btn-outline-dark mb-4 ms-2"
                          onClick={handleCancel}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProductSeller;
