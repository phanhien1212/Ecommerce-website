import { useEffect, useState } from "react";
import SellerService from "../../../service/SellerService";
import { Link, useParams } from "react-router-dom";
import { urlImage } from "../../../config";

const ShowSeller = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState({});
  useEffect(() => {
    (async () => {
      const result = await SellerService.getById(id);
      setSeller(result.data);
    })();
  }, [id]);
  return (
    <div class="content">
      <section class="content-header my-2">
        <h1 class="d-inline">Chi tiết</h1>
        <div class="row mt-2 align-items-center">
          <div class="col-md-12 text-end">
            <Link to="/admin/seller" className="btn btn-primary btn-sm me-2">
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
              <td>{seller.id}</td>
            </tr>
            <tr>
              <td>Họ Tên Khách Hàng</td>
              <td>{seller.firstname+" "+seller.lastname}</td>
            </tr>
            <tr>
              <td>Tên Người Dùng</td>
              <td>{seller.username}</td>
            </tr>
            <tr>
              <td>Ảnh Đại Diện</td>
              <td>
                <img
                  className="img-fluid"
                  style={{ width: 100, height: 100 }}
                  src={urlImage + "user/" + seller.image}
                  alt={seller.image}
                />
              </td>
            </tr>
            <tr>
              <td>Số Điện Thoại</td>
              <td>{seller.phone}</td>
            </tr>
            <tr>
              <td>Địa Chỉ Email</td>
              <td>{seller.email}</td>
            </tr>
            <tr>
              <td>Địa Chỉ Khách Hàng</td>
              <td>{seller.address}</td>
            </tr>
            <tr>
              <td>Trạng Thái</td>
              <td>{seller.status === 0 ? "Đã Ẩn" : "Đã Hiện"}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ShowSeller;
