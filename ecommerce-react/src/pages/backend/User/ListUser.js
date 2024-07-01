import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
import CustomerService from "../../../service/CustomerService";
import { Link } from "react-router-dom";
import UserService from "../../../service/UserService";
import { FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    (async () => {
      const result = await UserService.getAdmins();
      setUsers(result.data);
      setLoad(Date.now());
    })();
  }, [load]);

  const handDelete = (id) => {
    (async () => {
      const result = await UserService.destroy(id);
      toast.success("Xóa thành viên thành công!");
    })();
  };

  const handleStatus = (id) => {
    (async () => {
      const result = await UserService.updateStatus(id);
      toast.success("Thay đổi trạng thái thành công!");
    })();
  };
  return (
    <div>
      <ToastContainer />
      <section className="content-header my-2 mb-4 mt-4">
        <h1 className="d-inline">Quản trị viên</h1>
        <Link
          className="btn btn-outline-secondary ms-3"
          to="/admin/user/create"
        >
          Thêm mới quản trị viên
        </Link>
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
              <th style={{ width: 220 }}>Tên quản trị viên</th>
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
            {users &&
              users.map((user, index) => (
                <tr className="datarow">
                  <td>
                    <input type="checkbox" id="checkId" />
                  </td>
                  <td>
                    <img
                      className="img-fluid"
                      src={urlImage + "user/" + user.image}
                      alt="user.jpg"
                    />
                  </td>
                  <td>
                    <div className="firtname">
                      <Link to="user_edit.html">
                        {user.firstname + " " + user.lastname}
                      </Link>
                    </div>

                    <div className="function_style">
                      <button
                        onClick={() => handleStatus(user.id)}
                        className={
                          user.status === 1
                            ? " bg-light border-0 px-1 text-success"
                            : "bg-light border-0 px-1 text-danger"
                        }
                      >
                        {user.status === 1 ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <Link
                        to={"/admin/user/edit/" + user.id}
                        className="text-primary mx-1"
                      >
                        <i className="fa fa-edit" />
                      </Link>
                      <Link className="text-info mx-1">
                        <i className="fa fa-eye" />
                      </Link>
                      <button
                        type="button"
                        className="text-danger"
                        style={{ border: "none" }}
                        data-bs-toggle="modal"
                        data-bs-target={"#staticBackdrop" + user.id}
                      >
                        <FaTrash />
                      </button>
                      <div
                        className="modal fadein"
                        id={"staticBackdrop" + user.id}
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex={-1}
                        aria-labelledby={"staticBackdropLabel" + user.id}
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id={"staticBackdropLabel" + user.id}
                              >
                                Xóa Thành Viên
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              />
                            </div>
                            <div className="modal-body">
                              <p>Bạn muốn xóa thành viên?</p>
                              <div className="d-flex flex-row mb-3">
                                <div
                                  className="p-2"
                                  style={{ width: 100, height: 100 }}
                                >
                                  {" "}
                                  <img
                                    className="img-fluid"
                                    src={urlImage + "user/" + user.image}
                                    alt="user.jpg"
                                  />
                                </div>
                                <div className="p-2 d-flex align-items-center">
                                  <h5>{user.name}</h5>
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary "
                                data-bs-dismiss="modal"
                              >
                                Hủy
                              </button>
                              <button
                                type="button"
                                id={"buttonDelete" + user.id}
                                className="btn btn-danger "
                                data-bs-dismiss="modal"
                                onClick={() => handDelete(user.id)}
                              >
                                Xác nhận
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>{user.address}</td>
                  <td>{user.username}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td className="text-center">{user.id}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ListUser;
