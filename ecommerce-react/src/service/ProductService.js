import httpAxios from "../httpAxios";

const ProductService = {
  getList: () => {
    return httpAxios.get(`products`);
  },
  getProductSaleQtyStatus: () => {
    return httpAxios.get(`products-status-qty-sale`);
  },

  get(id, params) {
    var url = `product/ ${id}`;
    return httpAxios.get(url, { params });
  },

  getBySlug: (slug) => {
    return httpAxios.get(`products/${slug}`);
  },
  updatestatus: (id, data) => {
    return httpAxios.put(`/product/updatestatus/${id}`, data);
  },
  getattribute: (productId) => {
    return httpAxios.get(`/product/attribute/${productId}`);
  },
  productsellerid: (sellerId) => {
    return httpAxios.get(`products/seller/${sellerId}`);
  },
  getById: (id) => {
    return httpAxios.get(`product/${id}`);
  },
  store: (data) => {
    return httpAxios.post("product/create", data);
  },
  deleteProduct: (id) => {
    return httpAxios.delete(`product/delete/${id}`);
  },
  destroy: (id) => {
    return httpAxios.delete(`product/destroy/${id}`);
  },
  reduceStock: (productId, qty) => {
    return httpAxios.put(`/${productId}/reduce-stock?qty=${qty}`);
  },
  update: (id, data) => {
    return httpAxios.put(`product/update/${id}`, data);
  },
  restore: (id) => {
    return httpAxios.post(`product/restore/${id}`);
  },
  addattribute: (data) => {
    return httpAxios.post(`productAttribute`, data);
  },
  addproduct: (data) => {
    return httpAxios.post(`product`, data);
  },
  addproductimage: (data) => {
    return httpAxios.post(`productimage`, data);
  },

  search: (keyword) => {
    return httpAxios.post(`product/search`, keyword);
  },
  updateproduct(id, data) {
    return httpAxios.put(`product/${id}`, data);
  },
  updateproductattribute(id, data) {
    return httpAxios.put(`productAttribute/${id}`, data);
  },
  addflashsale(data) {
    return httpAxios.post(`flashsale`, data);
  },
  updatestatusflashsale(id) {
    return httpAxios.put(`/flashsale/updatestatus/${id}`);
  },
  getflashsalebyseller(id) {
    return httpAxios.get(`/flash-sales-with-details/${id}`);
  },
  deleteflashsale(id) {
    return httpAxios.delete(`/flashsale/destroy/${id}`);
  },
  getallflashsale() {
    return httpAxios.get(`flash-sales-with-details`);
  },
  getproductsalebyseller(id) {
    return httpAxios.get(`/products-sales-with-details/${id}`);
  },
  addproductsale(data) {
    return httpAxios.post(`productsale`, data);
  },

  addproductscore(data) {
    return httpAxios.post(`productScore`, data);
  },
  addscore(data) {
    return httpAxios.post(`/addProductScore`, data);
  },
  updatestatusproductsale(id) {
    return httpAxios.put(`/productsale/updatestatus/${id}`);
  },
  arrProductS(data) {
    return httpAxios.post(`/addProductScore`, data);
  },
  arrRank(categoryid) {
    return httpAxios.get(`/sellerScoresByCategory/${categoryid}`);
  },
  productcategoryid: (categoryId) => {
    return httpAxios.get(`products-status-qty-sale/${categoryId}`);
  },
  getsale: (productId) => {
    return httpAxios.get(`/product/sale/${productId}`);
  },
  getproductimage: (productId) => {
    return httpAxios.get(`/products/image/${productId}`);
  },
  categorysellerid: (sellerId) => {
    return httpAxios.get(`category/seller/${sellerId}`);
  },
  deleteSale: (id) => {
    return httpAxios.delete(`/productsale/destroy/${id}`);
  },
};
export default ProductService;
