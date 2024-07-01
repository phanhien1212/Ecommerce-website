import { useEffect, useState } from "react";
import "../../CSS/page-detail.css";
import PageService from "../../service/PageService";
import { useParams } from "react-router-dom";
const PageDetail = () => {
  const [page, setPage] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PageService.getById(id);
        setPage(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  return (
    <div className="grid wide">
      <div className="col l-2 m-0 c-0">
        <div className="category-pc" style={{ marginTop: 30 }}>
          <nav className="category">
            {/* Content category items */}
            <ul className="category-list">
              <li className="category-item">
                <div className="category-item__icon">
                  <i className="fas fa-caret-right" />
                </div>
                <a href="#" className="category-item__link">
                  Chính sách bảo mật
                </a>
              </li>
              <li className="category-item">
                <div className="category-item__icon">
                  <i className="fas fa-caret-right" />
                </div>
                <a href="#" className="category-item__link">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li className="category-item">
                <div className="category-item__icon">
                  <i className="fas fa-caret-right" />
                </div>
                <a href="#" className="category-item__link">
                  Giới thiệu
                </a>
              </li>
              <li className="category-item">
                <div className="category-item__icon">
                  <i className="fas fa-caret-right" />
                </div>
                <a href="#" className="category-item__link">
                  Tuyển dụng
                </a>
              </li>
              <li className="category-item">
                <div className="category-item__icon">
                  <i className="fas fa-caret-right" />
                </div>
                <a href="#" className="category-item__link">
                  Điều khoản
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div
        className="category_main_content___GfgUr"
        style={{ marginTop: -220, marginLeft: 150 }}
      >
        <div className="right___20U3i">
          <div className="article_detail___2DTOA is_pc___3cXET ql-snow">
            <h2 className="title___1AS6L">{page.title}</h2>
            <div className="content___1Q8Gm ql-editor pcContent___2eFux">
              <p
                style={{
                  marginTop: 0,
                  marginBottom: "0.75em",
                  lineHeight: "1.38",
                  textAlign: "justify",
                }}
              >
                <span style={{ color: "rgb(0, 0, 0)", fontSize: "14.6667px" }}>
                  {page.detail}
                </span>
              </p>
              <p>
                <br />
              </p>

              <p>
                <span style={{ color: "rgb(51, 51, 51)", fontSize: "13.8px" }}>
                  <img alt="done-gif.gif" />
                </span>
              </p>
            </div>

            <div className="related_articles_container___3Ur-S">
              <div className="related_articles___1jxUe is_pc___39okN">
                <div className="title___1vtu5">Bài viết liên quan</div>
                <div>
                  <div className="item___3fHzO">
                    [Thành viên mới] Tại sao tôi không thể bấm gửi yêu cầu Trả
                    Hàng/Hoàn Tiền được?
                  </div>
                </div>
                <div>
                  <div className="item___3fHzO">
                    [Thành viên mới] Tại sao một sản phẩm lại có nhiều số lượng
                    tồn kho khác nhau?
                  </div>
                </div>
                <div>
                  <div className="item___3fHzO">
                    [Thành viên mới] Thời gian tối đa để gửi yêu cầu Trả
                    hàng/Hoàn tiền trên ứng dụng Shopee?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDetail;
