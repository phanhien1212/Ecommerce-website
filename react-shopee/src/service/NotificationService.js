import httpAxios from "../httpAxios";

function getbyrepicientid(repicientid) {
  return httpAxios.get(`nofications/${repicientid}` );
}
function addNotification(formData) {
  return httpAxios.post(`nofication`,formData);
}
function changeStatus(id) {
  return httpAxios.put(`/nofication/updatestatus/${id}`);
}


const NotificationService = {
  getbyrepicientid: getbyrepicientid,
  addNotification: addNotification,
  changeStatus: changeStatus,
};
export default NotificationService;
