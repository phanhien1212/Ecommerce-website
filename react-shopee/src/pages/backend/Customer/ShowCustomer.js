import { useEffect, useState } from "react";
import CustomerService from "../../../service/CustomerService";
import { Link, useParams } from "react-router-dom";
import { urlImage } from "../../../config";

const ShowCustomer = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState({});
  useEffect(() => {
    (async () => {
      const result = await CustomerService.getById(id);
      setCustomer(result.data);
    })();
  }, [id]);
  return (
    <div class="content">
      <section class="content-header my-2">
        <h1 class="d-inline">Chi tiết</h1>
        <div class="row mt-2 align-items-center">
          <div class="col-md-12 text-end">
            <Link to="/admin/customer" className="btn btn-primary btn-sm me-2">
              <i className="fa fa-arrow-left" /> Về Danh Sách
            </Link>
          </div>
        </div>
      </section>
      <section class="content-body my-2">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: 180 }}>Tên trường</th>
              <th>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ID</td>
              <td>{customer.id}</td>
            </tr>
            <tr>
              <td>Họ Tên Khách Hàng</td>
              <td>{customer.name}</td>
            </tr>
            <tr>
              <td>Tên Người Dùng</td>
              <td>{customer.username}</td>
            </tr>
            <tr>
              <td>Ảnh Đại Diện</td>
              <td>
                <img
                  className="img-fluid"
                  style={{ width: 100, height: 100 }}
                  src={urlImage + "user/" + customer.image}
                  alt={customer.image}
                />
              </td>
            </tr>
            <tr>
              <td>Số Điện Thoại</td>
              <td>{customer.phone}</td>
            </tr>
            <tr>
              <td>Địa Chỉ Email</td>
              <td>{customer.email}</td>
            </tr>
            <tr>
              <td>Địa Chỉ Khách Hàng</td>
              <td>{customer.address}</td>
            </tr>
            <tr>
              <td>Trạng Thái</td>
              <td>{customer.status === 0 ? "Đã Ẩn" : "Đã Hiện"}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ShowCustomer;
