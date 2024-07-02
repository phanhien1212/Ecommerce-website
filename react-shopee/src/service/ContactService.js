import httpAxios from "../httpAxios";

function register(formData) {
  return httpAxios.post(`register`, formData);
}
function login(formData) {
  return httpAxios.post(`login`, formData);
}
function getall() {
  return httpAxios.get(`contacts`);
}
function sentmess(formData) {
  return httpAxios.post(`contact`,formData);
}
function updatestatus(id) {
  return httpAxios.put(`contact/updatestatus/${id}`,);
}
function message(seller,buyer) {
  return httpAxios.get(`contact/${seller}/${buyer}`);
}
function messageByReceiverId(receiverId) {
  return httpAxios.get(`contactseller/${receiverId}`);
}
function getContactReceiver(receiverId) {
  return httpAxios.get(`/contacts-with-users/${receiverId}`);
}
function getContactsWithSellerId(seller_id) {
  return httpAxios.get(`/contacts-with-sellerId/${seller_id}`);
}
function getContactsWithBuyerId(buyer_id) {
  return httpAxios.get(`/contacts-with-buyerId/${buyer_id}`);
}


const ContactService = {
  register: register,
  login: login,
  getall: getall,
  sentmess: sentmess,
  updatestatus: updatestatus,
  message: message,
  messageByReceiverId: messageByReceiverId,
  getContactReceiver: getContactReceiver,
  getContactsWithSellerId: getContactsWithSellerId,
  getContactsWithBuyerId: getContactsWithBuyerId,
};
export default ContactService;
