import httpAxios from "../httpAxios";

const ShopProfileService = {
  getShopProfile: () => {
    return httpAxios.get(`shopprofiles`);
  },

  getByIdShopProfile: (id) => {
    return httpAxios.get(`/shopprofile/${id}`);
  },
  addshop: (data) => {
    return httpAxios.post(`shopprofile`, data);
  },
  updateshop: (id, data) => {
    return httpAxios.put(`shopprofile/${id}`, data);
  },

  getShopProfileBySellerId: (sellerId) => {
    return httpAxios.get(`shopprofilebyseller/${sellerId}`);
  },
};
export default ShopProfileService;
