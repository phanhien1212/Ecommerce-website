import { useEffect, useState } from "react";
import { urlImage } from "../../../config";

const TrashContact = () => {
    
    return (
        <div>
            <section className="content-header my-2">
                <h1 className="d-inline">Thùng rác liên hệ</h1>
                <div className="row mt-3 align-items-center">
                    <div className="col-6">
                        <ul className="manager">
                            <li><a href="#">Tất cả (123)</a></li>
                            <li><a href="#">Xuất bản (12)</a></li>
                            <li><a href="#">Rác (12)</a></li>
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
                                <input type="checkbox" id="checkboxAll" />
                            </th>
                            <th>Họ tên</th>
                            <th>Điện thoại</th>
                            <th>Email</th>
                            <th>Tiêu đề</th>
                        </tr>
                    </thead>
                    <tbody>
                      
                        <tr className="datarow">
                            <td>
                                <input type="checkbox" id="checkId" />
                            </td>
                            <td>
                                <div className="name">
                                    <a href="contact_reply.html"></a>
                                </div>
                                <div className="function_style">
                                    <a  className="text-primary mx-1">
                                        <i className="fa fa-undo" />
                                    </a>
                                    <a  className="text-danger mx-1"  >
                                        <i className="fa fa-trash" />
                                    </a>
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                       
                    </tbody>
                </table>
            </section>
        </div>

    );
}

export default TrashContact;