import httpAxios from "../httpAxios";



const TransactionService = {

    storeTransaction: (data) => {
        return httpAxios.post(`/transaction`,data);
      },
    
   
  
}
export default TransactionService;
