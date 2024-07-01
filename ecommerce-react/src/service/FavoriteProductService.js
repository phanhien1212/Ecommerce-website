import httpAxios from "../httpAxios";



const FavoriteProductService = {

    destroy: (id) => {
        return httpAxios.delete(`fproduct/destroy/${id}`)
    },
    getFavoriteProductsByUserId: (userId) => {
        return httpAxios.get(`favorite-products/${userId}`)
    },
   
}
export default FavoriteProductService;
