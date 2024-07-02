import { Link } from "react-router-dom";
import BannerService from "../../../service/BannerService";
import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
const ListBanner = () => {
  const [banners, setBanners] = useState([]);
  const [status, setStatus] = useState(1);
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    (async () => {
      const result = await BannerService.getList();
      setBanners(result.data);
      setLoad(Date.now());
    })();
  }, [load]);

  const handDelete = (id) => {
    (async () => {
      const result = await BannerService.deleteBanner(id);
      if (result.data.status === true) {
        setLoad(Date.now());
      }
    })();
  };
  return (
    <div>
      <section className="content-header my-2 mt-3 mb-4">
        <h1 className="d-inline">Quản lý Banner</h1>
        <Link className="btn btn-outline-secondary ms-3" to="/admin/banner/create">
          Thêm mới
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
              <th>Tên banner</th>
              <th>Vị trí</th>
              <th>Liên kết</th>
              <th className="text-center" style={{ width: 30 }}>
                ID
              </th>
            </tr>
          </thead>
          <tbody>
            {banners &&
              banners.map((banner, index) => (
                <tr className="datarow">
                  <td className="text-center">
                    <input type="checkbox" />
                  </td>
                  <td>
                    <img
                      className="img-fluid"
                      src={urlImage + "banner/" + banner.image}
                      alt="banner.jpg"
                    />
                  </td>
                  <td>
                    <div className="name">
                      <Link to="banner_edit.html">{banner.name}</Link>
                    </div>
                    <div className="function_style">
                      <Link to="#" className="text-success mx-1">
                        <i className="fa fa-toggle-on" />
                      </Link>
                      <Link
                        to={"/admin/banner/edit/" + banner.id}
                        className="text-primary mx-1"
                      >
                        <i className="fa fa-edit" />
                      </Link>
                      <Link
                        to={"/admin/banner/show/" + banner.id}
                        className="text-info mx-1"
                      >
                        <i className="fa fa-eye" />
                      </Link>
                      <Link
                        onClick={() => handDelete(banner.id)}
                        className="text-danger mx-1"
                      >
                        <i className="fa fa-trash" />
                      </Link>
                    </div>
                  </td>
                  <td>{banner.position}</td>
                  <td>{banner.link}</td>
                  <td className="text-center">{banner.id}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ListBanner;
