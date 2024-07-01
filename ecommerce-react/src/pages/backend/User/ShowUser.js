import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserService from "../../../service/UserService";
import { urlImage } from "../../../config";

const ShowUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await UserService.getById(id);
      setUser(result.data.user);
    })();
  }, [id]);
  return (
    <div>
      <section className="content-header my-2">
        <h1 className="d-inline">Chi tiết</h1>
        <div className="row mt-2 align-items-center">
          <div className="col-md-12 text-end">
            <Link to="/admin/user" className="btn btn-primary btn-sm me-2">
              <i className="fa fa-arrow-left" /> Về Danh Sách
            </Link>
          </div>
        </div>
      </section>
      <section className="content-body my-2">
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
              <td>{user.id}</td>
            </tr>
            <tr>
              <td>Họ Tên Khách Hàng</td>
              <td>{user.firstname + " " + user.lastname}</td>
            </tr>
            <tr>
              <td>Tên Người Dùng</td>
              <td>{user.username}</td>
            </tr>
            <tr>
              <td>Ảnh Đại Diện</td>
              <td>
                <img
                  className="img-fluid"
                  style={{ width: 100, height: 100 }}
                  src={urlImage + "user/" + user.image}
                  alt={user.image}
                />
              </td>
            </tr>
            <tr>
              <td>Số Điện Thoại</td>
              <td>{user.phone}</td>
            </tr>
            <tr>
              <td>Địa Chỉ Email</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td>Địa Chỉ Khách Hàng</td>
              <td>{user.address}</td>
            </tr>
            <tr>
              <td>Trạng Thái</td>
              <td>{user.status === 0 ? "Đã Ẩn" : "Đã Hiện"}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ShowUser;
