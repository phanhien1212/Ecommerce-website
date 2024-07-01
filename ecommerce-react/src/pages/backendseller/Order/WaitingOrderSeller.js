import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderService from "../../../service/OrderService";
import UserService from "../../../service/UserService";
import { urlImage } from "../../../config";

const WaitingOrderSeller = () => {
  const sellerId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await OrderService.getOrderWithOrderDetails();
      const resultUser = await UserService.getUsers();
      setUsers(resultUser.data);
      const responseData = result.data; // Giả sử dữ liệu được lưu trong key "data"

      // Lọc ra các đơn hàng có seller_id giống với sellerId
      const filteredOrders = responseData.filter(
        (order) =>
          order.seller_id === parseInt(sellerId) && order.order_status === 0
      );

      // Tạo một đối tượng Map để nhóm các đơn hàng theo order_id
      const orderGroups = new Map();

      // Duyệt qua danh sách đơn hàng đã lọc và nhóm chúng vào Map
      filteredOrders.forEach((order) => {
        const orderId = order.order_id;
        if (!orderGroups.has(orderId)) {
          // Nếu chưa có nhóm cho order_id này, tạo một nhóm mới
          orderGroups.set(orderId, [order]);
        } else {
          // Nếu đã có nhóm cho order_id này, thêm đơn hàng vào nhóm đó
          orderGroups.get(orderId).push(order);
        }
      });

      // Chuyển đổi Map thành mảng các nhóm đơn hàng và cập nhật state
      const groupedOrders = Array.from(orderGroups.values());
      console.log("groupOrder", groupedOrders);
      setOrders(groupedOrders);
    })();
  }, [sellerId, orders]);

  console.log(orders);

  const getUserName = (userId) => {
    const username = users.find((user) => user.id === userId);
    return username ? username.username : "không có";
  };
  const getImageUser = (userId) => {
    const userr = users.find((user) => user.id === userId);
    return userr ? userr.image : "không có";
  };
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="d-flex p-2 row " style={{ height: 70 }}>
      <div className="col-md-12 border-bottom">
        <div className="d-flex flex-row mx-auto">
          <div className="p-2 me-3 my-auto">
            <Link className="" to={"/seller/orderseller/" + sellerId}>
              Tất cả
            </Link>
          </div>
          <div className=" p-2 me-3 my-auto ">
            <Link
              className="text-danger fw-bold"
              to={"/seller/orderseller/waitting/" + sellerId}
            >
              Chờ xác nhận{" "}
            </Link>
          </div>
          <div className="p-2 me-3 my-auto">
            <Link to={"/seller/orderseller/prepare/" + sellerId}>
              Chuẩn bị hàng
            </Link>
          </div>
          <div className="p-2 me-3 my-auto">
            <Link to={"/seller/orderseller/shipping/" + sellerId}>
              Đang giao
            </Link>
          </div>
          <div className="p-2 me-3 my-auto">
            <Link to={"/seller/orderseller/completed/" + sellerId}>
              Đã giao
            </Link>
          </div>
          <div className="p-2 me-3 my-auto">
            <Link to={"/seller/orderseller/cancel/" + sellerId}>Đã hủy</Link>
          </div>
          <div className="p-2 me-3 my-auto">
            <Link to={"/seller/orderseller/return/" + sellerId}>Trả hàng</Link>
          </div>
        </div>
      </div>
      <div className="col-md-12 mt-5">
        <div className="row">
          <h4 className="col-md-6 mt-2">{orders.length} kiện hàng</h4>
        </div>
      </div>
      <div className="col-md-12 mt-3">
        <table className="table mb-5 border">
          <thead className>
            <tr className="table-secondary">
              <th style={{ width: 400 }} scope="col">
                Sản phẩm
              </th>
              <th scope="col">Số lượng</th>
              <th scope="col">Tổng cộng</th>
              <th scope="col">Trạng thái</th>
              <th scope="col" style={{ width: 300 }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((orderGroup, index) => (
              <React.Fragment key={index}>
                <tr className="table-warning">
                  <td colSpan="2" style={{ height: 45 }}>
                    <div class="d-flex flex-row  align-items-center">
                      <div class="p-2">
                        <img
                          alt=""
                          className="rounded-circle"
                          src={
                            urlImage +
                            "user/" +
                            getImageUser(orderGroup[0].user_id)
                          }
                          style={{ width: 25, height: 25 }}
                        />
                      </div>
                      <div class="p-2">
                        {getUserName(orderGroup[0].user_id)}
                      </div>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="d-flex flex-row-reverse">
                      <div class="p-2">{orderGroup[0].order_id}</div>
                      <div class="p-2">Mã đơn hàng: </div>
                      <div class="p-2">
                        {" "}
                        <Link
                          to={
                            "/seller/orderseller/orderdetail/" +
                            orderGroup[0].order_id
                          }
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
                {orderGroup.map((order) => (
                  <tr className="table">
                    <td>
                      <div class="d-flex flex-row mb-3">
                        <div class="p-2">
                          {" "}
                          <img
                            className="img-fluid"
                            src={urlImage + "product/" + order.product_image}
                            alt="product.jpg"
                            style={{ width: 100, height: 100 }}
                          />
                        </div>
                        <div class="p-2 d-flex flex-column">
                          {" "}
                          <div class="p-2">
                            {" "}
                            <Link
                              to={"/seller/product/edit/" + order.product_id}
                            >
                              {order.product_name}
                            </Link>
                          </div>
                          <div class="p-2">{order.order_detail_attribute}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p>{order.order_detail_qty}</p>
                    </td>
                    <td>
                      <p>{formatPrice(order.order_detail_amount)}</p>
                    </td>

                    <td>
                      {(() => {
                        switch (order.order_detail_status) {
                          case 1:
                            return "Chuẩn bị hàng";
                          case 0:
                            return "Chờ xác nhận";
                          case 2:
                            return "Đang giao";
                          case 3:
                            return "Đã giao";
                          case 4:
                            return "Đã hủy";
                          case 5:
                            return "Trả hàng";
                          default:
                            return "Hết hàng";
                        }
                      })()}
                    </td>
                    <td>
                      <p>
                        <Link>Xem sản phẩm</Link>
                      </p>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WaitingOrderSeller;
