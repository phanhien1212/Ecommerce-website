import React from 'react';
import {  useNavigate } from "react-router-dom";

const RegisterSeller = () => {
  const navigate = useNavigate();
  const Next = async (e) => {
    e.preventDefault();
    navigate("/acc/register");
  };
  return ( 
    <div className="container">
      <div className="container mt-4 d-flex justify-content-center align-items-center flex-column" style={{ backgroundColor: '#ffffff', height: 650 }}>
        <div className="p-2">
          <img src="https://deo.shopeesz.com/shopee/pap-admin-live-sg/upload/upload_9dab85081088531ee6d1aa958a90f55e.png" style={{ width: 200, height: 200 }} alt="Stressmama Logo" />
        </div>
        <div className="p-2"><h3 style={{ fontSize: 20 }}>Chào mừng bạn đến với Stressmama</h3></div>
        <div className="p-2 colorgray">
          <p>Vui lòng cung cấp thông tin để thành lập tài khoản người bán trên Stressmama</p>
        </div>
        <div className="p-2" style={{ marginBottom: 30 }}>
          <button onClick={Next} type="button" style={{ fontSize: 14, width: 180, height: 36 }} className="btn btn-danger mb-4 mx-auto">
            Bắt đầu đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default RegisterSeller;
