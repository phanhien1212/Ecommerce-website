import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import OrderService from "../../../service/OrderService";
import UserService from "../../../service/UserService";
import { urlImage } from "../../../config";
import NotificationService from "../../../service/NotificationService";
import { ToastContainer } from "react-toastify";

const OrderDetail = () => {
  const { id } = useParams();
  const [load, setLoad] = useState(Date.now());
  const [user, setUser] = useState({});
  const [users, setUsers] = useState({});
  const [order, setOrder] = useState({});

  const sellerId = localStorage.getItem("userId");
  const [orderdetails, setOrderDetails] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await OrderService.getbyid(id);
      setOrder(result.data);
      const idBuyer = result.data.user_id;
      const resultUsers = await UserService.getUsers();
      setUsers(resultUsers.data);

      const resultUser = await UserService.getById(idBuyer);
      setUser(resultUser.data);
      const resultOrderDetail = await OrderService.getOrderDetailByOrderId(id);

      setOrderDetails(resultOrderDetail.data);
    })();
  }, [load, id]);
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const totalAmount = orderdetails
    .filter((order) => order.seller_id === parseInt(sellerId))
    .reduce((total, order) => total + order.order_detail_amount, 0);
  const handleConfirm = async (id, userid, status) => {
    try {
      let newStatus = ""; // Define a variable to hold the new status
      switch (status) {
        case 0:
          newStatus = 1;
          break;
        case 1:
          newStatus = 2; // Set new status to 2 if status is 1
          break;
        case 2:
          newStatus = 3;
          break;
        case 3:
          newStatus = 4;
          break;
        case 4:
          newStatus = 5;
          break;
        case 5:
          newStatus = 6;
          break;
        default:
          newStatus = 7;
      }

      const ordetails = orderdetails.filter(
        (od) => od.seller_id === parseInt(sellerId)
      );
      const updateStatus = new FormData();
      updateStatus.append("status", newStatus); // Set status to 1

      await OrderService.updatestatusorder(order.id, updateStatus);

      for (const order of ordetails) {
        const updateStatus = new FormData();
        updateStatus.append("status", newStatus);
        const result = await OrderService.updatestatusorderdetail(
          order.order_detail_id,
          updateStatus
        );
        if (result.status === 200) {
          const u = users.find((nd) => nd.id === userid);
          var username = u.username;
          const addNotification = new FormData();
          addNotification.append(
            "content",
            `${username} ơi, đơn hàng của bạn vừa được xác nhận, XEM NGAY`
          );
          addNotification.append("title", `Đơn hàng của bạn đã được xác nhận`);
          addNotification.append("recipient_id", userid);
          addNotification.append("status", 1);
          addNotification.append(
            "link",
            `orderdetail/${order.order_detail_id}`
          );
          addNotification.append("role", `customer`);
          setLoad(Date.now());

          const resultNotification = await NotificationService.addNotification(
            addNotification
          );

          console.log(
            `Notification sent to user ${userid}`,
            resultNotification
          );
        }
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm hoặc gửi thông báo:", error);

      if (error.response) {
        console.error("Thông báo lỗi từ máy chủ:", error.response.data.message);
      }
    }
  };
  return (
    <div>
      <>
        <ToastContainer position="top-center" />
        <div className="row">
          <div
            className="col-md-8 ms-4 d-flex flex-column mb-3 rounded-2  border"
            style={{ width: 1200, backgroundColor: "#f6f6f6" }}
          >
            <div className="p-2 mt-4">
              <h4>
                {(() => {
                  switch (order.status) {
                    case 0:
                      return "Chưa Xác Nhận";
                    case 1:
                      return "Chuẩn Bị Hàng";
                    case 2:
                      return "Đang Giao";
                    case 3:
                      return "Đã Giao";
                    case 4:
                      return "Đã Hủy";
                    case 5:
                      return "Trả Hàng";
                    default:
                      return "Hết Hàng";
                  }
                })()}
              </h4>
            </div>

            <div className="function_style " style={{ marginLeft: 10 }}>
              {(() => {
                switch (order.status) {
                  case 0:
                    return (
                      <div>
                        {/* Button trigger modal */}
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ height: 40 }}
                          data-bs-toggle="modal"
                          data-bs-target={"#staticBackdrop" + order.id}
                        >
                          Xác nhận đơn hàng
                        </button>
                        {/* Modal */}

                        <div
                          className="modal fadein"
                          id={"staticBackdrop" + order.id}
                          data-bs-backdrop="static"
                          data-bs-keyboard="false"
                          tabIndex={-1}
                          aria-labelledby={"staticBackdropLabel" + order.id}
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5"
                                  id={"staticBackdropLabel" + order.id}
                                >
                                  Xác nhận đơn hàng
                                </h1>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                />
                              </div>
                              <div className="modal-body">
                                <p>Sản phẩm đơn hàng</p>
                                {orderdetails
                                  .filter(
                                    (order) =>
                                      order.seller_id === parseInt(sellerId)
                                  )
                                  .map((order, index) => (
                                    <div className="d-flex flex-row mb-3">
                                      <div
                                        className="p-2"
                                        style={{ width: 100, height: 100 }}
                                      >
                                        {" "}
                                        <img
                                          className="img-fluid"
                                          src={
                                            urlImage +
                                            "product/" +
                                            order.product_image
                                          }
                                          alt="product.jpg"
                                        />
                                      </div>
                                      <div className="p-2 d-flex align-items-center">
                                        <h5>{order.product_name}</h5>
                                      </div>
                                    </div>
                                  ))}
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
                                  id={"buttonDelete" + order.id}
                                  className="btn btn-danger "
                                  data-bs-dismiss="modal"
                                  onClick={() =>
                                    handleConfirm(order.id, order.user_id, 0)
                                  }
                                >
                                  Xác nhận
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  case 1:
                    return (
                      <div>
                        {/* Button trigger modal */}
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ height: 40 }}
                          data-bs-toggle="modal"
                          data-bs-target={"#staticBackdrop" + order.id}
                        >
                          Giao hàng cho đơn vị vận chuyển
                        </button>
                        {/* Modal */}

                        <div
                          className="modal fadein"
                          id={"staticBackdrop" + order.id}
                          data-bs-backdrop="static"
                          data-bs-keyboard="false"
                          tabIndex={-1}
                          aria-labelledby={"staticBackdropLabel" + order.id}
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5"
                                  id={"staticBackdropLabel" + order.id}
                                >
                                  Xác nhận đơn hàng
                                </h1>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                />
                              </div>
                              <div className="modal-body">
                                <p>Sản phẩm đơn hàng</p>
                                {orderdetails
                                  .filter(
                                    (order) =>
                                      order.seller_id === parseInt(sellerId)
                                  )
                                  .map((order, index) => (
                                    <div className="d-flex flex-row mb-3">
                                      <div
                                        className="p-2"
                                        style={{ width: 100, height: 100 }}
                                      >
                                        {" "}
                                        <img
                                          className="img-fluid"
                                          src={
                                            urlImage +
                                            "product/" +
                                            order.product_image
                                          }
                                          alt="product.jpg"
                                        />
                                      </div>
                                      <div className="p-2 d-flex align-items-center">
                                        <h5>{order.product_name}</h5>
                                      </div>
                                    </div>
                                  ))}
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
                                  id={"buttonDelete" + order.id}
                                  className="btn btn-danger "
                                  data-bs-dismiss="modal"
                                  onClick={() =>
                                    handleConfirm(order.id, order.user_id, 1)
                                  }
                                >
                                  Xác nhận giao cho đơn vị vận chuyển
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  case 2:
                    return "Đơn Hàng Đang Được Giao Đến Khách Hàng";
                  case 3:
                    return "Đơn Hàng Đã Hoàn Thành";
                  case 4:
                    return "Đã Hủy";
                  case 5:
                    return "Trả Hàng";
                  default:
                    return "Hết Hàng";
                }
              })()}

              <br />
            </div>
          </div>
        </div>

        <div
          className="d-flex flex-column mb-3 rounded-2  border mt-2"
          style={{ width: 1200, backgroundColor: "#f6f6f6" }}
        >
          <div className="p-2 ms-4 mt-4">
            <h4>Mã Đơn Hàng</h4>
          </div>
          <div className="p-2 ms-4">{order.id}</div>
          <div className="p-2 ms-4 mt-4">
            <h4>Địa Chỉ Nhận Hàng</h4>
          </div>
          <div className="p-2 ms-4">
            <span>{order.deliveryName}</span>,{" "}
            <span>{order.deliveryPhone}</span>
          </div>
          <div className="p-2 ms-4">{order.deliveryAddress}</div>
        </div>
        <div
          className="d-flex flex-row mb-3 rounded-2 mt-2  border"
          style={{ width: 1200, backgroundColor: "#f6f6f6" }}
        >
          <div className="p-2 ms-4 mt-4 d-flex flex-row">
            <div className="p-2">
              <img
                className="rounded-circle"
                style={{ width: 44, height: 44 }}
                src={urlImage + "user/" + user.image}
                alt=""
              />
            </div>
            <div className="p-2 mt-2">
              <Link to>{user.username}</Link>
            </div>
          </div>
          <div className="p-2 ms-4 mt-4 d-flex justify-content-end">
            <div className="p-2" style={{ marginLeft: 740 }}></div>
            <div className="p-2">
              <button
                type="button"
                className="btn btn-outline-danger mb-4"
                style={{ fontSize: 14 }}
              >
                Chat ngay
              </button>
            </div>
          </div>
        </div>
        <div
          className="d-flex flex-row mb-3 rounded-2  border mt-2"
          style={{ width: 1200, backgroundColor: "#f6f6f6" }}
        >
          <div className="p-2 ms-4 mt-4 d-flex flex-column">
            <div className="p-2">
              <h5>Thông tin thanh toán</h5>
            </div>
            <div className="p-2 d-flex flex-row">
              <div className="p-2" style={{ width: 800 }}>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col">Sản Phẩm</th>
                      <th scope="col">Đơn Giá</th>
                      <th scope="col">Số Lượng</th>
                      <th scope="col">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderdetails
                      .filter((order) => order.seller_id === parseInt(sellerId))
                      .map((order, index) => (
                        <tr>
                          <th scope="row">1</th>
                          <td>
                            <div className="d-flex flex-row mb-3">
                              <div className="p-2">
                                <img
                                  className="img-fluid"
                                  src={
                                    urlImage + "product/" + order.product_image
                                  }
                                  alt="product.jpg"
                                  style={{ width: 100, height: 100 }}
                                />
                              </div>
                              <div className="p-2 d-flex flex-column">
                                <div className="p-2">
                                  <Link
                                    to="/seller/orderseller/5"
                                    previewlistener="true"
                                  >
                                    {order.product_name}
                                  </Link>
                                </div>
                                <div className="p-2">
                                  {" "}
                                  {order.order_detail_attribute}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{formatPrice(order.order_detail_price)}</td>
                          <td>{order.order_detail_qty}</td>
                          <td>{formatPrice(order.order_detail_amount)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="p-2 ">
                <div className="p-2 d-flex flex-row mt-4">
                  <div className="p-2" style={{ width: 230 }}>
                    <h5 className="colorshopee">Tổng Tiền Sản Phẩm</h5>
                  </div>
                  <div className="p-2">
                    <h5 className="colorshopee">{formatPrice(totalAmount)}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default OrderDetail;
