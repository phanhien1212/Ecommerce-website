import httpAxios from "../httpAxios";

function getList()
{
    return httpAxios.get("banners1and2")
}
function getList1()
{
    return httpAxios.get("banners1")
}

function getById(id)
{
    return httpAxios.get(`banner/${id}`)

}
function getListTrash()
{
    return httpAxios.get("banner/trash")
}
function store(data)
{
    return httpAxios.post("banner",data)
}
function deleteBanner(id)
{
    return httpAxios.put(`banner/delete/${id}`)
}
function destroy(id)
{
    return httpAxios.delete(`banner/destroy/${id}`)
}
function update(id, data){
    return httpAxios.put(`banner/update/${id}`,data);
  }
  
  function restore(id) {
    return httpAxios.put(`banner/restore/${id}`);
}
function updateStatus(id, updateStatus){
    return httpAxios.put(`banner/update/${id}`,updateStatus);
  }
const BannerService = {
    getById :getById,
    getList :getList,
    store:store,
    destroy:destroy,
    update:update,
    deleteBanner:deleteBanner,
    getListTrash:getListTrash,
    restore: restore,
    updateStatus:updateStatus,
    getList1:getList1

}
export default BannerService;