import httpAxios from "../httpAxios";

const ShippingService = {
  getShopProfile: () => {
    return httpAxios.get(`shopprofiles`);
  },

  getByIdShopProfile: (id) => {
    return httpAxios.get(`/shopprofile/${id}`);
  },
  addShip: (data) => {
    return httpAxios.post(`shipping`, data);
  },
  updateshop: (id, data) => {
    return httpAxios.put(`shopprofile/${id}`, data);
  },

  getShopProfileBySellerId: (sellerId) => {
    return httpAxios.get(`shopprofilebyseller/${sellerId}`);
  },
};
export default ShippingService;
