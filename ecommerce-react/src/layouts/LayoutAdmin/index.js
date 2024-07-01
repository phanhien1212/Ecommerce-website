import { Outlet, Link, useNavigate } from "react-router-dom";
import { FaProductHunt } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { GiKnightBanner } from "react-icons/gi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../CSS/admin.css";
import { useEffect, useState } from "react";
import { SiShopee } from "react-icons/si";
import { FaShopify } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import NotificationService from "../../service/NotificationService";
import ProductService from "../../service/ProductService";
const LayoutAdmin = () => {
  const [notification, setNotification] = useState([]);
  const [products, setProducts] = useState([]);
  const [load, setLoad] = useState(Date.now());
  const adminId = localStorage.getItem("userId");
  function handleItemClick(item) {
    const hdlitem = document.getElementById(item);
    // hdlitem.classList.toggle("active");
  }
  useEffect(() => {
    (async () => {
      const resultNotifications = await NotificationService.getbyrepicientid(
        adminId
      );
      const resultProducts = await ProductService.getList();
      setProducts(resultProducts.data);
      const noti = resultNotifications.data.filter(
        (notification) => notification.role === "admin"
      );
      const sortedNotis = noti.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setNotification(sortedNotis);
    })();
  }, [notification]);
  const changeStatus = async (id, status) => {
    try {
      // Kiểm tra nếu status bằng 1 thì mới thay đổi trạng thái
      if (status === 1) {
        const result = await NotificationService.changeStatus(id);
        // Nếu đang tìm kiếm, cập nhật lại dữ liệu tìm kiếm
        if (result.status === 200) {
          setLoad(Date.now());
        }
      } else {
        console.log("Status is not 1, no changes made.");
      }
    } catch (error) {
      console.error("Lỗi thay đổi trạng thái:", error);

      if (error.response) {
        console.error("Thông báo lỗi từ máy chủ:", error.response.data.message);
      }
    }
  };
  return (
    <>
      <section className="hdl-header sticky-top">
        <div className="container-fluid">
          <ul className="menutop" style={{ height: 50 }}>
            <li>
              <Link className="menutop" to="">
                <SiShopee style={{ marginTop: -3 }} /> STRESSMAMA
              </Link>
            </li>
            <li className="text-phai" style={{ height: 28 }}>
              <div class="dropdown">
                <button
                  class="btn btn-dark dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ height: 28 }}
                >
                  <IoIosNotifications />{" "}
                  <span class="ms-2 me-2 badge text-bg-danger">
                    {notification.filter((noti) => noti.status === 1).length ===
                    0
                      ? ""
                      : notification.filter((noti) => noti.status === 1).length}
                  </span>
                </button>
                <ul class="dropdown-menu">
                  {notification &&
                    notification.map((noti) => (
                      <li
                        style={{ width: 300, height: 60 }}
                        className={`border-bottom ${
                          noti.status === 1 ? "bg-body-secondary" : ""
                        }`}
                      >
                        <Link
                          onClick={() => changeStatus(noti.id, noti.status)}
                          class=""
                          to={noti.link}
                        >
                          <b>{noti.title}</b>
                          <br />
                          <span title={noti.content}>
                            {noti.content.length > 35
                              ? noti.content.substring(0, 35) + "..."
                              : noti.content}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="hdl-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2 bg-dark p-0 hdl-left">
              <div className="hdl-left">
                <div className="dashboard-name">Bản điều khiển</div>
                <nav className="m-2 mainmenu" style={{ maxWidth: 500 }}>
                  <ul className="main">
                    <li
                      className="hdlitem item-sub active"
                      id="item1"
                      onClick={() => handleItemClick("item1")}
                    >
                      <FaShopify className="icon-left" />
                      <Link to="/admin/product">Sản phẩm</Link>
                      <FaPlus className="icon-right" />
                      <ul className="submenu">
                        <li>
                          <Link to="/admin/productwaitting">
                            Sản phẩm chưa duyệt
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/productviolate">
                            Sản phẩm vi phạm
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/category">Danh mục</Link>
                        </li>
                      </ul>
                    </li>

                    <li
                      className="hdlitem item-sub active"
                      id="item4"
                      onClick={() => handleItemClick("item4")}
                    >
                      <FaShopify className="icon-left" />
                      <Link to="/admin/customer">Quản lý thành viên</Link>
                      <FaPlus className="icon-right" />
                      <ul className="submenu">
                        <li>
                          <Link to="/admin/customer">Quản lý khách hàng</Link>
                        </li>
                        <li>
                          <Link to="/admin/seller">Quản lý người bán</Link>
                        </li>
                        <li>
                          <Link to="/admin/user">Quản trị viên</Link>
                        </li>
                      </ul>
                    </li>

                    <li
                      className="hdlitem item-sub active"
                      id="item8"
                      onClick={() => handleItemClick("item8")}
                    >
                      <IoIosNotifications className="icon-left" />
                      <Link to="/admin/page">Quản lý trang đơn</Link>
                      <FaPlus className="icon-right" />
                      <ul className="submenu">
                        <li>
                          <Link to="/admin/page">Quản lý bài viết</Link>
                        </li>
                        <li>
                          <Link to="/admin/topic">Quản lý chủ đề</Link>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="hdlitem item-sub active"
                      id="item3"
                      onClick={() => handleItemClick("item3")}
                    >
                      <FaShopify className="icon-left" />
                      <Link to="/admin/businessperformance">
                        Hiệu suất kinh doanh
                      </Link>
                      <FaPlus className="icon-right" />
                      <ul className="submenu">
                        <li>
                          <Link to="/admin/businessperformance">
                            Xếp hạng theo danh mục
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/revenuestatistics/">
                            Thống kê doanh thu
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/advertisment">
                            Thống kê quảng cáo
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="hdlitem">
                      <FaRegCircle className="icon-left" />
                      <Link to="/admin/contact">Liên hệ</Link>
                    </li>
                    <li className="hdlitem">
                      <GiKnightBanner className="icon-left" />
                      <Link to="/admin/banner">Banner</Link>
                    </li>

                    <li
                      className="hdlitem item-sub"
                      id="item6"
                      onClick={() => handleItemClick("item7")}
                    >
                      <FaShopify className="icon-left" />
                      <Link to="#">Hệ thống</Link>
                      <FaPlus className="icon-right" />
                      <ul className="submenu">
                        <li>
                          <Link to="/admin/user">Thông báo</Link>
                        </li>
                        <li>
                          <Link to="/admin/config">Cấu hình</Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col-md-10">
              <div className="content">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LayoutAdmin;
