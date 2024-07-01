import httpAxios from "../httpAxios";

function getList()
{
    return httpAxios.get("topics")
}

function getById(id)
{
    return httpAxios.get(`topic/${id}`)

}
function getList1()
{
    return httpAxios.get("topic/trash")
}
function store(data)
{
    return httpAxios.post("topic",data)
}
function deleteBrand(id)
{
    return httpAxios.post(`topic/delete/${id}`)
}
function destroy(id)
{
    return httpAxios.delete(`topic/destroy/${id}`)
}
function update(id, data){
    return httpAxios.put(`topic/${id}`,data);
  }
  function restore(id) {
    return httpAxios.put(`topic/restore/${id}`);
}
function updateStatus(id){
    return httpAxios.put(`topic/updatestatus/${id}`);
}
const TopicService = {
    getById :getById,
    getList :getList,
    store:store,
    destroy:destroy,
    update:update,
    delete:deleteBrand,
    getList1:getList1,
    restore: restore,
    updateStatus:updateStatus
}
export default TopicService;