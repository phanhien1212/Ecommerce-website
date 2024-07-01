import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
const ReplyContact = () => {
    
    return (
        <div>
            <form  action method="post" encType="multipart/form-data">
            <section className="content-header my-2">
                <h1 className="d-inline">Trả lời liên hệ</h1>
                <div className="text-end">
                    <a href="contact_index.html" className="btn btn-sm btn-success">
                        <i className="fa fa-arrow-left" /> Về danh sách
                    </a>
                    <button type="submit" className="btn btn-success btn-sm text-end">
                        <i className="fa fa-save" aria-hidden="true" /> Trả lời liên hệ
                    </button>
                </div>
            </section>
            <section className="content-body my-2">
                <div className="row">
                    <div className="col-4">
                        <div className="mb-3">
                            <label htmlFor="name" className="text-main">Họ tên</label>
                            <input type="text" name="name" id="name" className="form-control" placeholder="Nhập họ tên" readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="mb-3">
                            <label htmlFor="phone" className="text-main">Điện thoại</label>
                            <input type="text" name="phone" id="phone" className="form-control" placeholder="Nhập điện thoại" readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="mb-3">
                            <label htmlFor="email" className="text-main">Email</label>
                            <input type="text" name="email"  id="email" className="form-control" placeholder="Nhập email" readOnly />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="mb-3">
                            <label htmlFor="title" className="text-main">Tiêu đề</label>
                            <input type="text" name="title"  id="title" className="form-control" placeholder="Nhập tiêu đề" readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="content_old" className="text-main">Nội dung</label>
                            <textarea name="content_old"  id="content_old" className="form-control" placeholder="Nhập nội dung liên hệ" readOnly defaultValue={""} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="content" className="text-main">Nội dung trả lời</label>
                            <textarea name="content"  id="content" className="form-control" placeholder="Nhập nội dung liên hệ" rows={5} defaultValue={""} />
                        </div>
                    </div>
                </div>
            </section>
            </form>
        </div>

    );
}

export default ReplyContact;