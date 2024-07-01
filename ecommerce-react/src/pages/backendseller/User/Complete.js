import { useEffect, useState } from "react";
import CustomerService from "../../../service/CustomerService";
import { urlImage } from "../../../config";
import UserService from "../../../service/UserService";
import { Link } from "react-router-dom";

const Complete = () => {
    const sellerid = localStorage.getItem("userId");
    const [user, setUser] = useState({});
    const [load, setLoad] = useState(Date.now());
    useEffect(() => {
        (async () => {
          const resultUser = await UserService.getById(sellerid);
          setUser(resultUser.data);
          console.log(resultUser);
        })();
      }, [load]);
  return (
    <div>
      <section className="hdl-headerr sticky-top">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2" />
            <div className="col-md-7">
              <h4 className="mt-3">Đăng ký trở thành người bán Stressmama</h4>
            </div>
            <div className="col-md-3">
              <div
                className="accordion accordion-flush"
                id="accordionExample"
                style={{
                  marginRight: "-12px",
                  border: "none",
                  margin: "auto",
                  width: "240.66px",
                }}
              >
                <div className="accordion-item">
                  <h5 className="accordion-header">
                    <button
                      className="accordion-button"
                      style={{
                        outline: "none",
                        boxShadow: "none",
                        border: "none",
                        backgroundColor: "#ffffff",
                        fontSize: 14,
                      }}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      <img
                        style={{ width: 35, height: 35 }}
                        className="rounded-circle"
                        src={urlImage + "user/" + user.image}
                        alt="product.jpg"
                      />
                      <span className="ms-2">{user.username} </span>
                    </button>
                  </h5>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                    style={{ width: 200 }}
                  >
                    <div className="accordion-body">
                      <div className="d-flex justify-content-center flex-column">
                        <div class="p-2">
                          <img
                            style={{ width: 70, height: 70 }}
                            className="rounded-circle"
                            src={urlImage + "user/" + user.image}
                            alt="product.jpg"
                          />
                        </div>
                        <div class="p-2">
                          {" "}
                          <p className="mt-2">{user.username}</p>
                        </div>
                      </div>
                      <hr style={{ width: 200 }} />
                      <div>
                        <button
                          type="button"
                          style={{
                            fontSize: 13,
                            borderRadius: 0,
                            width: "240.66px",
                            marginLeft: "-20px",
                          }}
                          className="btn btn-light small"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hdl-contentt">
        <div className="container">
          <div
            className="container mt-4 d-flex justify-content-center align-items-center flex-column"
            style={{ backgroundColor: "#ffffff", height: 590 }}
          >
            <div className="p-2">
              <h3>Hoàn Tất</h3>
            </div>
            <div className="p-2">
              <hr style={{ width: 800 }} />
            </div>
            <div className="p-2">
              <img
                src="https://deo.shopeesz.com/shopee/pap-admin-live-sg/upload/upload_1396437671da07b5825d85e6f0eb7916.png"
                style={{ width: 80, height: 80 }}
                alt=""
              />
            </div>
            <div className="p-2 ">
              <h4 style={{ fontSize: 20 }}>Đăng ký thành công</h4>
            </div>
            <div className="p-2 colorgray">
                Hãy đăng bán sản phẩm đầu tiên để khởi động hành trình bán hàng
                cùng<br/>
                <span style={{ marginLeft: 160 }}>Stressmama nhé!</span>
            </div>
            <div className="p-2  " style={{ marginBottom: 30 }}>
              <Link
              to="/seller"
                style={{ fontSize: 14, width: 180 }}
                className="btn btn btn-danger mb-4 mx-auto"
              >
                Bắt đầu bán hàng
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Complete;
