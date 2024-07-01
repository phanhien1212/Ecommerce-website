const TrashProductSeller = () => {
    return (
        <div>
            <section className="content-header my-2">
                <h3 className="d-inline">Thùng rác sản phẩm</h3>
                <div className="row mt-3 align-items-center">
                    <div className="col-6">
                        <ul className="manager">
                            <li><a href="product_index.html">Tất cả (123)</a></li>
                            <li><a href="#">Xuất bản (12)</a></li>
                            <li><a href="product_trash.html">Rác (12)</a></li>
                        </ul>
                    </div>
                    <div className="col-6 text-end">
                        <input type="text" className="search d-inline" />
                        <button className="d-inline btnsearch">Tìm kiếm</button>
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
                            <th className="text-center" style={{ width: 130 }}>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Tên danh mục</th>
                            <th>Tên thương hiệu</th>
                            <th className="text-center" style={{ width: 30 }}>ID</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr className="datarow">
                            <td>
                                <input type="checkbox" id="checkId" />
                            </td>
                            <td>
                                <img className="img-fluid" alt="product.jpg" />
                            </td>
                            <td>
                                <div className="name">
                                    <a href="product_edit.html">

                                    </a>
                                </div>
                                <div className="function_style">
                                    <a href="#" className="btn btn-primary btn-sm" >
                                        <i className="fa fa-undo" />
                                    </a>
                                    <a href="#" className="btn btn-danger btn-sm" >
                                        <i className="fa fa-trash" />
                                    </a>
                                </div>
                            </td>
                            <td>Tên danh mục</td>
                            <td>Tên Thuong hiệu</td>
                            <td className="text-center"></td>
                        </tr>

                    </tbody>
                </table>
            </section>
            <section className="content-header my-2">
                <div className="row mt-2 align-items-center">
                    <div className="col-md-3">

                    </div>
                    <div className="col-md-3 text-end">
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
        </div>
    );
}

export default TrashProductSeller;