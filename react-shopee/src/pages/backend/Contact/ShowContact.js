import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

const ShowContact = () => {
   
    return (
        <div>
            <section className="content-header my-2">
                <h1 className="d-inline">Chi tiết</h1>
                <div className="row mt-2 align-items-center">
                    <div className="col-md-12 text-end">
                        <a href="contact_index.html" className="btn btn-primary btn-sm">
                            <i className="fa fa-arrow-left" /> Về danh sách
                        </a>
                        <a href="contact_reply.html" className="btn btn-success btn-sm">
                            <i className="fa fa-edit" /> Sửa
                        </a>
                        <a href className="btn btn-danger btn-sm">
                            <i className="fa fa-trash" /> Xóa
                        </a>
                    </div>
                </div>
            </section>
            <section className="content-body my-2">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: 180 }}>Tên trường</th>
                            <th>Giá trị</th>
                        </tr>
                    </thead>
                    <tbody>
                   
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                       
                    </tbody>
                </table>
            </section>
        </div>

    );
}

export default ShowContact;