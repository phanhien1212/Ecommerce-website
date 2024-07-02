import httpAxios from "../httpAxios";



const ReviewService = {

    getList: () => {
        return httpAxios.get(`reviews`)
    },
    
    getByIdReview: (productId) => {
        return httpAxios.get(`/product/review/${productId}`)

    },
    addFeedBack: (data) => {
        return httpAxios.post(`review`,data)

    },
    getByIdReviewProduct: (productId) => {
        return httpAxios.get(`/product/review/${productId}`)

    },
    getByIdReviewUser: (user_id) => {
        return httpAxios.get(`/user/review/${user_id}`)

    },
  
}
export default ReviewService;
