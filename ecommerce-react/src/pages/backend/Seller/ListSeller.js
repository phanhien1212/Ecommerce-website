import { useEffect, useState } from "react";
import SellerService from "../../../service/SellerService";
import { Link } from "react-router-dom";
import { urlImage } from "../../../config";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
const ListSeller = () => {
  const [sellers, setSellers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    (async () => {
      const result = await SellerService.getSeller();
      setSellers(result.data);
      setLoad(Date.now());
    })();
  }, [load]);

  const handDelete = (id) => {
    (async () => {
      const result = await SellerService.deleteSeller(id);
      if (result.data.status === true) {
        setLoad(Date.now());
      }
    })();
  };

  const handleStatus = (id) => {
    (async () => {
      const result = await SellerService.updateStatus(id);
      if (result.data.status === true) {
        setLoad(Date.now());
      }
    })();
  };
  return (
    <div>
      <section className="content-header my-2 mb-4">
        <h1 className="d-inline">Danh sách nhà bán hàng</h1>
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
              <th style={{ width: 220 }}>Tên nhà bán hàng</th>
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
            {sellers &&
              sellers.map((seller, index) => (
                <tr className="datarow">
                  <td>
                    <input type="checkbox" id="checkId" />
                  </td>
                  <td>
                    <img
                      className="img-fluid"
                      src={urlImage + "user/" + seller.image}
                      alt="seller.jpg"
                    />
                  </td>
                  <td>
                    <div className="firtname">
                      <Link to={"/admin/seller/" + seller.id}>
                        {seller.firstname + " " + seller.lastname}
                      </Link>
                    </div>

                    <div className="function_style">
                      <Link
                        to={"/admin/seller/" + seller.id}
                        className="px-1 rounded-2 mt-2 bg-info text-light"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </td>

                  <td>{seller.address}</td>
                  <td>{seller.username}</td>
                  <td>{seller.phone}</td>
                  <td>{seller.email}</td>
                  <td className="text-center">{seller.id}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ListSeller;
