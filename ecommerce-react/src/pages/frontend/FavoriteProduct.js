import { PiAddressBook } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { MdFavoriteBorder } from "react-icons/md";
import { CgPassword } from "react-icons/cg";
import { useEffect, useState } from "react";
import axios from "axios";
import UserService from "../../service/UserService";
import { urlImage } from "../../config";
import FavoriteProductService from "../../service/FavoriteProductService";
const FavoriteProduct = () => {
  const [userId, setUserId] = useState(null);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const storedUserId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        setUserId(storedUserId);
        const result = await UserService.getById(storedUserId);
        setUser(result.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [load]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await FavoriteProductService.getFavoriteProductsByUserId(userId);
        setFavoriteProducts(response.data);
        setLoad(Date.now());
      } catch (error) {
        console.error("Error fetching followed shops:", error);
      }
    };
    fetchData();
  }, [load, userId]);

  const handDestroy = (id) => {
    (async () => {
      const result = await FavoriteProductService.destroy(id);
      if (result.data.status === true) {
        setLoad(Date.now());
      }
    })();
    setLoad(Date.now());
  };
  const navigate = useNavigate();
  return (
    <div className="app__container">
      <div className="grid wide">
        <div className="row sm-gutter app__content">
          <div className="col l-2 m-0 c-0">
            <div className="category-pc">
              <nav className="category">
                {user && (
                  <div className="AmWkJQ">
                    <a className="_1O4r+C" href="/user/account/profile">
                      <div className="shopee-avatar">
                        <img
                        alt=""
                          className="shopee-avatar__img"
                          src={urlImage + "user/" + user.image}
                        />
                      </div>
                    </a>
                    <div className="miwGmI" style={{ marginLeft: 20 }}>
                      <div className="mC1Llc">{user.username}</div>
                      <div>
                        <a className="_78QHr1" href="/user/account/profile">
                          <svg
                            width={12}
                            height={12}
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: 4 }}
                          >
                            <path
                              d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48"
                              fill="#9B9B9B"
                              fillRule="evenodd"
                            />
                          </svg>
                          Sửa hồ sơ
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content category items */}
                <ul
                  className="category-list"
                  style={{ marginTop: 10, marginLeft: -5 }}
                >
                  <li className="category-item ">
                    <div className="category-ac-item__icon">
                      <img
                      alt=""
                        style={{ width: 20 }}
                        src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"
                      ></img>
                    </div>
                    <a
                      href="/account"
                      style={{ marginLeft: 6 }}
                      className="category-item__link"
                    >
                      Hồ sơ
                    </a>
                  </li>
                  
                  <li className="category-item">
                    <div className="category-ac-item__icon ">
                      <img
                      alt=""
                        style={{ width: 20 }}
                        src="https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078"
                      ></img>
                    </div>
                    <a
                      href="/order"
                      style={{ marginLeft: 6 }}
                      className="category-item__link"
                    >
                      Đơn mua
                    </a>
                  </li>
                  <li className="category-item">
                    <div className="category-ac-item__icon ">
                      <MdFavoriteBorder
                        style={{ fontSize: 20, color: "red" }}
                      />
                    </div>
                    <a
                      href="/favorite-product"
                      style={{ marginLeft: 6 }}
                      className="category-item__link"
                    >
                      Sản phẩm yêu thích
                    </a>
                  </li>
                  <li className="category-item">
                    <div className="category-ac-item__icon ">
                      <CgPassword style={{ fontSize: 20, color: "black" }} />
                    </div>
                    <a
                      href="/change-password"
                      style={{ marginLeft: 6 }}
                      className="category-item__link"
                    >
                      Đổi mật khẩu
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div
            className="col l-10 m-12 c-12 my-account"
            style={{ backgroundColor: "white" }}
          >
            {/* No cart: Header__cart-list--no-cart */}
            <div
              className="header__cart-heading"
              style={{ fontSize: 18, marginLeft: 15, marginTop: 10 }}
            >
              Sản phẩm yêu thích
            </div>
            <div className="home-product" style={{ marginTop: -15 }}>
              <main
                aria-role="tabpanel"
                aria-labelledby="olp_tab_id-0.44408754544375273"
                id="olp_panel_id-0.44408754544375273"
              >
                <h2 className="a11y-hidden"></h2>

                <div>
                  <div className="J632se">
                    {favoriteProducts.map((favoriteProduct) => (
                      <section>
                        <h3 className="a11y-hidden"></h3>

                        <div
                          onClick={() =>
                            navigate("/product-detail/" + favoriteProduct.slug)
                          }
                        >
                          <div className="bdAfgU">
                            <div className="FNHV0p">
                              <div>
                                <section>
                                  <div className="mZ1OWk">
                                    <div className="dJaa92">
                                      <img
                                        src={
                                          urlImage +
                                          "product/" +
                                          favoriteProduct.product_image
                                        }
                                        className="gQuHsZ"
                                        alt=""
                                        tabIndex={0}
                                      />
                                      <div className="nmdHRf">
                                        <div>
                                          <div className="zWrp4w">
                                            <span
                                              className="DWVWOJ"
                                              tabIndex={0}
                                            >
                                              {favoriteProduct.product_name}
                                            </span>
                                          </div>
                                        </div>
                                        <div>
                                          <div
                                            className="rsautk"
                                            tabIndex={0}
                                            style={{ fontSize: 14 }}
                                          >
                                            Thêm vào lúc 20:00:19 06/04/2024
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="ylYzwa" tabIndex={0}>
                                      <div className="YRp1mm">
                                        <span
                                          className="nW_6Oi"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handDestroy(
                                              favoriteProduct.favorite_product_id
                                            );
                                          }}
                                        >
                                          Xóa
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteProduct;
