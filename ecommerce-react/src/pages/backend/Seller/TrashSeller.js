import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
import CustomerService from "../../../service/CustomerService";
import SellerService from "../../../service/SellerService";

const TrashSeller = () => {
  const [sellers, setCustomers] = useState([]);
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
      (async () => {
          const result = await SellerService.getSellerTrash();
          setCustomers(result.data);
      })();
  }, [load]);

  const handDestroy = (id) => {
      (async () =>{
          const result = await SellerService.destroy(id);
           if(result.data.status === true)
           {
               setLoad(Date.now());
           }
           })();  
           setLoad(Date.now());
    };

  const handRestore = (id) => {
      (async () => {
         
              const result = await SellerService.restore(id);
              if (result.data.status === true) {
                 
                  setLoad(Date.now());
              }
              setLoad(Date.now());
      })();
  };



    return ( 
       
  <div className="content">
    <section className="content-header my-2">
      <h1 className="d-inline">Thùng rác khách hàng</h1>
      <div className="row mt-3 align-items-center">
        <div className="col-6">
          <ul className="manager">
            <li><a href="seller_index.html">Tất cả (123)</a></li>
            <li><a href="#">Xuất bản (12)</a></li>
            <li><a href="seller_edit.html">Rác (12)</a></li>
          </ul>
        </div>
        <div className="col-6 text-end">
          <input type="text" className="search d-inline" />
          <button className="d-inline btnsearch">Tìm kiếm</button>
        </div>
      </div>
      <div className="row mt-1 align-items-center">
        <div className="col-md-8">
          <select name className="d-inline me-1">
            <option value>Hành động</option>
            <option value>Bỏ vào thùng rác</option>
          </select>
          <button className="btnapply">Áp dụng</button>
        </div>
        <div className="col-md-4 text-end">
          <nav aria-label="Page navigation example">
            <ul className="pagination pagination-sm justify-content-end">
              <li className="page-item disabled">
                <a className="page-link">«</a>
              </li>
              <li className="page-item"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#">»</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
    <section className="content-body my-2">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="text-center" style={{width: 30}}>
              <input type="checkbox" id="checkboxAll" />
            </th>
            <th className="text-center" style={{width: 130}}>Hình ảnh</th>
            <th>Họ tên</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th className="text-center" style={{width: 130}}>ID</th>
          </tr>
        </thead>
        <tbody>
        {sellers && sellers.map((seller, index) => (
          <tr className="datarow">
            <td>
              <input type="checkbox" id="checkId" />
            </td>
            <td>
              <img className="img-fluid" src={urlImage + "seller/" + seller.image} alt="user.jpg" />
            </td>
            <td>
              <div className="name">
                <a href="seller_edit.html">
                  {seller.username}
                </a>
              </div>
              <div className="function_style">
                <a  className="text-primary mx-1" onClick={() => handRestore(seller.id)}>
                  <i className="fa fa-undo" />
                </a>
                <a className="text-danger mx-1" onClick={() => handDestroy(seller.id)}>
                  <i className="fa fa-trash" />
                </a>
              </div>
            </td>
            <td>{seller.phone}</td>
            <td>{seller.email}</td>
            <td className="text-center">{seller.id}</td>
          </tr>
           ))}
        </tbody>
      </table>
    </section>
  </div>


     );
}
 
export default TrashSeller;