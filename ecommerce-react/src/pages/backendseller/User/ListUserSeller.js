import { Link } from "react-router-dom";

const ListUserSeller = () => {
    return ( 
        <div>
        <section className="content-header my-2">
            <h1 className="d-inline">Thành viên</h1>
            <a href="/admin/user/create" className="btn-add">Thêm mới</a>
            <div className="row mt-3 align-items-center">
                <div className="col-6">
                    <ul className="manager">
                        <li><a href="user_index.html">Tất cả (123)</a></li>
                        <li><a href="#">Xuất bản (12)</a></li>
                        <li><a href="/admin/user/trash">Rác (12)</a></li>
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
                        <th className="text-center" style={{ width: 30 }}>
                            <input type="checkbox" id="checkAll" />
                        </th>
                        <th className="text-center" style={{ width: 90 }}>Hình ảnh</th>
                        <th>Họ tên</th>
                        <th>Điện thoại</th>
                        <th>Email</th>
                        <th className="text-center" style={{ width: 30 }}>ID</th>
                    </tr>
                </thead>
                <tbody>
                
                    <tr className="datarow">
                        <td className="text-center">
                            <input type="checkbox" id="checkId" />
                        </td>
                        <td>
                            <img className="img-fluid"  alt="user.jpg" />
                        </td>
                        <td>
                            <div className="name">
                                <a href="menu_index.html">
                                   
                                </a>
                            </div>
                            <div className="function_style">
                                <Link href="#" className="text-success mx-1">
                                    <i className="fa fa-toggle-on" />
                                </Link>
                                <Link  className="text-primary mx-1">
                                    <i className="fa fa-edit" />
                                </Link>
                                <Link  className="text-info mx-1">
                                    <i className="fa fa-eye" />
                                </Link>
                                <Link  className="text-danger mx-1">
                                    <i className="fa fa-trash" />
                                </Link>
                            </div>
                        </td>
                        <td> </td>
                        <td> </td>
                        <td className="text-center"> </td>
                    </tr>
                     
                </tbody>
            </table>
        </section>
        </div>
     );
}
 
export default ListUserSeller;