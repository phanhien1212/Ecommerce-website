import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
import { Link } from "react-router-dom";
import BannerService from "../../../service/BannerService";
const TrashBanner = () => {
    const [banners, setBanners] = useState([]);
    const [load, setLoad] = useState(Date.now());
    useEffect(() => {
        (async () => {
            const result = await BannerService.getListTrash();
            setBanners(result.data);
            setLoad(Date.now());
        })();
    }, [load]);
    const handDestroy = (id) => {
        (async () =>{
            const result = await BannerService.destroy(id);
             if(result.data.status === true)
             {
                 setLoad(Date.now());
             }
             })();  
      };

    const handRestore = (id) => {
        (async () => {
           
                const result = await BannerService.restore(id);
                if (result.data.status === true) {
                   
                    setLoad(Date.now());
                }
        })();
    };
    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Thùng rác Banner</h1>
                <div className="row mt-3 align-items-center">
                    <div className="col-6">
                        <ul className="manager">
                            <li><a href="banner_index.html">Tất cả (123)</a></li>
                            <li><a href="#">Xuất bản (12)</a></li>
                            <li><a href="banner_trash.html">Rác (12)</a></li>
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
                        <select name className="d-inline me-1">
                            <option value>Tất cả vị trí</option>
                        </select>
                        <button className="btnfilter">Lọc</button>
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
                            <th className="text-center" style={{ width: 90 }}>Hình ảnh</th>
                            <th>Tên banner</th>
                            <th>Liên kết</th>
                            <th>Vị trí</th>
                            <th className="text-center" style={{ width: 30 }}>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                    {banners && banners.map((banner, index) => (
                        <tr className="datarow">
                            <td className="text-center">
                                <input type="checkbox" />
                            </td>
                            <td>
                                <img className="img-fluid" src={urlImage + "banner/" + banner.image} alt="banner.jpg" />
                            </td>
                            <td>
                                <div className="name">
                                    <a href="banner_edit.html">
                                    {banner.name}
                                    </a>
                                </div>
                                <div className="function_style">
                                    <a className="text-primary mx-1" onClick={() => handRestore(banner.id)}>
                                        <i className="fa fa-undo" />
                                    </a>
                                    <a  className="text-danger mx-1"  onClick={() => handDestroy(banner.id)}>
                                        <i className="fa fa-trash" />
                                    </a>
                                </div>
                            </td>
                            <td>{banner.link}</td>
                            <td>{banner.position}</td>
                            <td className="text-center">{banner.id}</td>
                        </tr>
                         ))}
                    </tbody>
                </table>
            </section>
        </div>

    );
}

export default TrashBanner;