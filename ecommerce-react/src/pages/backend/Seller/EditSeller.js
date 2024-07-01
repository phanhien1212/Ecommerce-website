import { useEffect, useState } from "react";

import CustomerService from "../../../service/CustomerService";
import { useParams } from "react-router-dom";
import { urlImage } from "../../../config";
import SellerService from "../../../service/SellerService";

const EditSeller = () => {
    const { id } = useParams();
    const [sellers, setCustomers] = useState([]);
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [phone, setPhone] = useState("");
    const [updated_by, setUpdatedBy] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState(1);
    const [imageUrl, setImageUrl] = useState("");
    const [load, setLoad] = useState(Date.now());
    useEffect(() => {
      (async () => {
          const result = await SellerService.getById(id);
          const sellerData = result.data;
          setFirstName(sellerData.firstname);
          setLastName(sellerData.lastname);
          setUsername(sellerData.username);
          setEmail(sellerData.email);
          setPhone(sellerData.phone);
          setGender(sellerData.gender);
          setPassword(sellerData.password);
          setRole(sellerData.role);
          setUpdatedBy(sellerData.updated_by);
          setAddress(sellerData.address);
          setStatus(sellerData.status);
          setImageUrl(`${urlImage}seller/${sellerData.image}`);
      })();
  }, [id, load]);

  const handSubmit = async (event) => {
      event.preventDefault();

      var image = document.getElementById("image");
      var seller = new FormData();
      seller.append("firstname", firstname);
      seller.append("lastname", lastname);
      seller.append("username", username);
      seller.append("status", status);
      seller.append("email", email);
      seller.append("password", password);
      seller.append("phone", phone);
      seller.append("gender", gender);
      seller.append("role", role);
      seller.append("updated_by", updated_by);
      seller.append("address", address);
      seller.append("image", image.files.length === 0 ? "" : image.files[0]);


      const result = await SellerService.update(id, seller);
      console.log(result.data); // Log response từ API để kiểm tra lỗi
      if (result.data.status === true) {

          setLoad(Date.now());
      }

  };

  const handleImageChange = (e) => {
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };
    return ( 
     
  <div className="content">
    <form onSubmit={handSubmit} >
    <section className="content-header my-2">
      <h1 className="d-inline">Sữa người bán</h1>
      <div className="row mt-2 align-items-center">
        <div className="col-md-12 text-end">
          <button type="submit" className="btn btn-success btn-sm" name="THEM">
            <i className="fa fa-save" /> Lưu [Thêm]
          </button>
          <a href="user_index.html" className="btn btn-primary btn-sm">
            <i className="fa fa-arrow-left" /> Về danh sách
          </a>
        </div>
      </div>
    </section>
    <section className="content-body my-2">
      
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label><strong>Tên đăng nhập(*)</strong></label>
              <input type="text"  name="username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" placeholder="Tên đăng nhập" />
            </div>
            <div className="mb-3">
              <label><strong>Mật khẩu(*)</strong></label>
              <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Mật khẩu" />
            </div>
            <div className="mb-3">
              <label><strong>Xác nhận mật khẩu(*)</strong></label>
              <input type="password" name="re_password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Xác nhận mật khẩu" />
            </div>
            <div className="mb-3">
              <label><strong>Email(*)</strong></label>
              <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email" />
            </div>
            <div className="mb-3">
              <label><strong>Xác nhận email(*)</strong></label>
              <input type="text" name="re_email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Xác nhận email" />
            </div>
            <div className="mb-3">
              <label><strong>Điện thoại(*)</strong></label>
              <input type="text" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" placeholder="Điện thoại" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label><strong>First name (*)</strong></label>
              <input type="text" name="firstname"  value={firstname} onChange={(e) => setFirstName(e.target.value)} className="form-control" placeholder="Họ tên" />
            </div>
            <div className="mb-3">
              <label><strong>Last name (*)</strong></label>
              <input type="text" name="lastname"  value={lastname} onChange={(e) => setLastName(e.target.value)} className="form-control" placeholder="Họ tên" />
            </div>
            
            <div className="mb-3">
              <label><strong>Giới tính</strong></label>
              <select name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="form-control">
                <option>Chọn giới tinh</option>
                <option >Nam</option>
                <option >Nữ</option>
              </select>
            </div>
            <div className="mb-3">
              <label><strong>Địa chỉ</strong></label>
              <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" placeholder="Địa chỉ" />
            </div>
            <div className="mb-3">
              <label><strong>Hình đại diện</strong></label>
              <input type="file"onChange={handleImageChange} name="image" id="image" className="form-control" />
              <div style={{width:200}}>{imageUrl && <img src={imageUrl} alt="Customer Image" />}</div>
            </div>
            <div className="mb-3">
              <label><strong>Trạng thái</strong></label>
              <select name="status" className="form-control" onChange={(e) => setStatus(e.target.value)} >
                <option value={1}>Xuất bản</option>
                <option value={2}>Chưa xuất bản</option>
              </select>
            </div>
          </div>
        </div>
    </section>
    </form>
  </div>


     );
}
 
export default EditSeller;