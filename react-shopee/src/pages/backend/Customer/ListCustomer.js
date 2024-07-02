import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
import CustomerService from "../../../service/CustomerService";
import { Link } from "react-router-dom";
const ListCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    (async () => {
      const result = await CustomerService.getCustomers();
      setCustomers(result.data);
      setLoad(Date.now());
    })();
  }, [load]);

  const handDelete = (id) => {
    (async () => {
      const result = await CustomerService.deleteCustomer(id);
      if (result.data.status === true) {
        setLoad(Date.now());
      }
    })();
  };
  return (
    <div>
      <section className="content-header my-2 mb-5 mt-3">
        <h1 className="d-inline mt-3">Danh sách khách hàng</h1>
      </section>
      <section className="content-body my-2">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="text-center" style={{ width: 30 }}>
                <input type="checkbox" id="checkboxAll" />
              </th>
              <th className="text-center" style={{ width: 130 }}>
                Hình ảnh
              </th>
              <th>Tên khách hàng</th>
              <th>Địa chỉ</th>
              <th>Tên người dùng</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th className="text-center" style={{ width: 30 }}>
                ID
              </th>
            </tr>
          </thead>
          <tbody>
            {customers &&
              customers.map((customer, index) => (
                <tr className="datarow">
                  <td>
                    <input type="checkbox" id="checkId" />
                  </td>
                  <td>
                    <img
                      className="img-fluid"
                      src={urlImage + "user/" + customer.image}
                      alt="customer.jpg"
                    />
                  </td>
                  <td>
                    <div className="firtname">
                      <Link to={"/admin/customer/" + customer.id}>
                        {customer.firstname + " " + customer.lastname}
                      </Link>
                    </div>

                    <div className="function_style">
                      <Link
                        to={"/admin/customer/" + customer.id}
                        className="px-1 rounded-2 mt-2 bg-info text-light"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </td>

                  <td>{customer.address}</td>
                  <td>{customer.username}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td className="text-center">{customer.id}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ListCustomer;
