import httpAxios from "../httpAxios";

const OrderService = {
  getList: () => {
    return httpAxios.get(`orders`);
  },
  getbyid: (id) => {
    return httpAxios.get(`order/${id}`);
  },

  storeorder: (data) => {
    return httpAxios.post(`/order`, data);
  },
  updatestatusorderdetail: (id,data) => {
    return httpAxios.put(`/orderdetail/updatestatus/${id}`, data);
  },
  updatestatusorder: (id,data) => {
    return httpAxios.put(`/order/updatestatus/${id}`, data);
  },

  storeorderdetail: (data) => {
    return httpAxios.post(`/orderdetail`, data);
  },
  getOrderDetailByOrderId: (orderId) => {
    return httpAxios.get(`orders-with-details/${orderId}`);
  },
  getOrderDetailById: (orderId) => {
    return httpAxios.get(`/orderdetails-by-id/${orderId}`);
  },
  getOrderWithOrderDetails: () => {
    return httpAxios.get(`orders-with-details`);
  },
};
export default OrderService;
