import httpAxios from "../httpAxios";



const SellerService = {

    getSeller: () => {
        return httpAxios.get(`sellers`)
    },
    getSellerTrash: () => {
        return httpAxios.get(`sellers/trash`)
    },
    getById: (id) => {
        return httpAxios.get(`seller/${id}`)
    },
    deleteSeller: (id) => {
        return httpAxios.put(`seller/delete/${id}`)
    },
    destroy: (id) => {
        return httpAxios.delete(`seller/destroy/${id}`)
    },
    update: (id, data) => {
        return httpAxios.put(`seller/update/${id}`, data);
    },
    updateStatus: (id) => {
        return httpAxios.put(`seller/updatestatus/${id}`);
    },
    restore: (id) => {
        return httpAxios.put(`seller/restore/${id}`);
    },
    

}
export default SellerService;
