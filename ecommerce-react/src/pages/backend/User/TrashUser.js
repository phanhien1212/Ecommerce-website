import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
import UserService from "../../../service/UserService";

const TrashUser = () => {
    const [users, setUsers] = useState([]);
    const [load, setLoad] = useState(Date.now());
    useEffect(() => {
        (async () => {
            const result = await UserService.getList1();
            setUsers(result.data.users);
        })();
    }, [load]);

    const handDestroy = (id) => {
        (async () => {
            const result = await UserService.destroy(id);
            if (result.data.status === true) {
                setLoad(Date.now());
            }
        })();
    };

    const handRestore = (id) => {
        (async () => {

            const result = await UserService.restore(id);
            if (result.data.status === true) {

                setLoad(Date.now());
            }
        })();
    };
    return (
        <div>
            <section className="content-header my-2">
                <h1 className="d-inline">Thùng rác thành viên</h1>
                <div className="row mt-3 align-items-center">
                    <div className="col-6">
                        <ul className="manager">
                            <li><a href="user_index.html">Tất cả (123)</a></li>
                            <li><a href="#">Xuất bản (12)</a></li>
                            <li><a href="user_trash.html">Rác (12)</a></li>
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
                            <option value>Khôi phục</option>
                            <option value>Xóa</option>
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
                            <th className="text-center" style={{ width: 30 }}>
                                <input type="checkbox" id="checkAll" />
                            </th>
                            <th className="text-center" style={{ width: 130 }}>Hình ảnh</th>
                            <th>Họ tên</th>
                            <th>Điện thoại</th>
                            <th>Email</th>
                            <th className="text-center" style={{ width: 30 }}>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map((user, index) => (
                            <tr className="datarow">
                                <td>
                                    <input type="checkbox" id="checkId" />
                                </td>
                                <td>
                                    <img className="img-fluid" src={urlImage + "user/" + user.image} alt="user.jpg" />
                                </td>
                                <td>
                                    <div className="name">
                                        <a href="user_edit.html">
                                            {user.name}
                                        </a>
                                    </div>
                                    <div className="function_style">
                                        <a className="text-primary mx-1" onClick={() => handRestore(user.id)}>
                                            <i className="fa fa-undo" />
                                        </a>
                                        <a className="text-danger mx-1" onClick={() => handDestroy(user.id)}>
                                            <i className="fa fa-trash" />
                                        </a>
                                    </div>
                                </td>
                                <td> {user.phone}</td>
                                <td> {user.email}</td>
                                <td className="text-center"> {user.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>

    );
}

export default TrashUser;