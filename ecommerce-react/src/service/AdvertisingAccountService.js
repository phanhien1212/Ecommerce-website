import httpAxios from "../httpAxios";

function addAdAccount(data) {
  return httpAxios.post("advertisingAccount",data);
}
function getSurByUserId(userid) {
  return httpAxios.get(`advertisingAccount/${userid}`);
}
function updateBalance(userid,amount) {
  return httpAxios.put(`updateBalance/${userid}/${amount}`);
}
const AdvertisingAccountService = {
  addAdAccount,addAdAccount,
  getSurByUserId,getSurByUserId,
  updateBalance,updateBalance,
};
export default AdvertisingAccountService;
