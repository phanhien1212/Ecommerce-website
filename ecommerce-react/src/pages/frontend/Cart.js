import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  decreaseCount,
  removeOneFromCart,
  increaseCountCart,
} from "../../state/cartSlice";
import currency from "currency.js";
import { urlImage } from "../../config";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ShopProfileService from "../../service/ShopProfileService";

const Cart = () => {
  const dispatch = useDispatch();
  const userId = parseInt(localStorage.getItem("userId")); // Lấy userId từ localStorage
  const cartItems = useSelector((state) =>
    state.cart.items.filter((item) => item.userId === userId)
  );
  const totalItems = cartItems.reduce((total, item) => {
    return total + item.count;
  }, 0);
  const [isChecked, setIsChecked] = useState(false);

  const handleToggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const total = cartItems.reduce((totalPrice, item) => {
    return totalPrice + item.count * item.price;
  }, 0);

  const groupItemsByStore = (items) => {
    const groupedItems = {};
    items.forEach((item) => {
      if (!groupedItems[item.storeName]) {
        groupedItems[item.storeName] = [item];
      } else {
        groupedItems[item.storeName].push(item);
      }
    });
    return groupedItems;
  };

  // Nhóm các sản phẩm theo tên cửa hàng
  const groupedItems = groupItemsByStore(cartItems);

  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const handleShopCheckboxChange = (storeName, isChecked) => {
    if (isChecked) {
      // Thêm tất cả các sản phẩm của cửa hàng vào danh sách đã chọn
      setSelectedItems((prevItems) => [
        ...prevItems,
        ...groupedItems[storeName].map((item) => ({
          itemId: item.id,
          selectedOptions: item.selectedOptions,
          name: item.name,
          image: item.image,
          price: item.price,
          storeName: storeName,
          count: item.count,
          seller_id: item.seller_id,
        })),
      ]);
    } else {
      // Loại bỏ tất cả các sản phẩm của cửa hàng ra khỏi danh sách đã chọn
      setSelectedItems((prevItems) =>
        prevItems.filter((item) => item.storeName !== storeName)
      );
    }
  };

  // Hàm xử lý khi chọn checkbox của sản phẩm
  const handleItemCheckboxChange = (
    itemId,
    selectedOptions,
    name,
    image,
    price,
    storeName,
    productWithAdCampaignId,
    count,
    seller_id,
    isChecked
  ) => {
    if (isChecked) {
      // Thêm sản phẩm vào danh sách đã chọn
      setSelectedItems((prevItems) => [
        ...prevItems,
        {
          itemId,

          selectedOptions,
          name,
          image,
          price,
          storeName,
          productWithAdCampaignId,
          count,
          seller_id,
        },
      ]);
    } else {
      // Loại bỏ sản phẩm ra khỏi danh sách đã chọn
      setSelectedItems((prevItems) =>
        prevItems.filter((item) => item.itemId !== itemId)
      );
    }
  };

  // Hàm xử lý khi nhấn vào nút "Mua hàng"
  const handleCheckout = async () => {
    // Tạo một mảng để chứa các promise của việc lấy thông tin của shop
    const shopProfilePromises = selectedItems.map(async (item) => {
      // Lấy thông tin shop profile và chờ cho đến khi nó hoàn thành
      const shopProfile = await ShopProfileService.getShopProfileBySellerId(
        item.seller_id
      );
      return {
        ...item,
        latitude: shopProfile.data.latitude,
        longitude: shopProfile.data.longitude,
      };
    });

    // Đợi tất cả các promise hoàn thành
    const itemsWithShopProfile = await Promise.all(shopProfilePromises);
    const selectedItemsQuery = itemsWithShopProfile
      .map(
        (item) =>
          `itemId=${item.itemId}&name=${item.name}&image=${item.image}&price=${item.price
          }&storeName=${item.storeName}&count=${item.count
          }&selectedOptions=${JSON.stringify(item.selectedOptions)}&ad_id=${item.productWithAdCampaignId
          }&latitude=${item.latitude}&longitude=${item.longitude}`
      )
      .join("&");

    // Tiếp tục xử lý khi tất cả thông tin đã sẵn sàng
    navigate(`/checkout?${selectedItemsQuery}`);
  };

  return (
    <div>
      <div className="grid wide" style={{ paddingBottom: 25 }}>
        <div className="cart-suggestion">
          <span>
            Nhấn vào mục Mã giảm giá ở cuối trang để hưởng miễn phí vận chuyển
            bạn nhé!
          </span>
        </div>
        {/* Cart product header */}
        <div className="cart-page-product-header hide-on-mobile-tablet">
          <span className="cart-page-product-header__product">
            <i className="fas fa-cart-arrow-down" />
            Sản Phẩm
          </span>
          <span className="cart-page-product-header__unit-price">Đơn Giá</span>
          <span className="cart-page-product-header__qnt">Số Lượng</span>
          <span className="cart-page-product-header__total-price">Số Tiền</span>
          <span className="cart-page-product-header__action">Thao Tác</span>
        </div>
        {/* Cart shop content*/}
        {Object.keys(groupedItems).map((storeName) => (
          <div className="cart-page-shop-container">
            <div className="cart-page-shop__header">
              <div className="shop-checkbox shop-checkbox-sup">
                <input
                  className="shop-checkbox__input"
                  type="checkbox"
                  onChange={(e) =>
                    handleShopCheckboxChange(storeName, e.target.checked)
                  }
                />
                <div className="shop-checkbox__bgc" />
              </div>

              <span className="cart-page-shop__header-name">{storeName}</span>
              <button className="cart-page-shop__header-btn-chat">
                <i className="cart-page-shop__header-icon fas fa-comment-alt" />
              </button>
            </div>
            <div className="cart-page-shop__container-items">
              <div className="cart-bundle">
                {groupedItems[storeName].map((item) => (
                  <div className="cart-item-container">
                    <div className="cart-item">
                      <div className="shop-checkbox shop-checkbox-sup">
                        <input
                          className="shop-checkbox__input"
                          type="checkbox"
                          onChange={(e) =>
                            handleItemCheckboxChange(
                              item.id,
                              item.selectedOptions,
                              item.name,
                              item.image,
                              item.price,
                              storeName,
                              item.productWithAdCampaignId,
                              item.count,
                              item.seller_id,
                              e.target.checked
                            )
                          }
                        />
                        <div className="shop-checkbox__bgc" />
                      </div>
                      <div className="cart-item__overview">
                        <a href="#" className="cart-item__overview-img-link">
                          <img
                            className="cart-item__overview-img"
                            src={urlImage + "product/" + item.image}
                          />
                        </a>
                        <a href="#" className="cart-item__overview-name">
                          {item.name}
                        </a>
                      </div>
                      <div className="cart-item__variations">
                        <div className="cart-item__variation-label">
                          Phân loại hàng:
                          <button className="cart-item__variation-btn-arrow">
                            <i className="cart-item__variation-icon-arrow-down fas fa-sort-down" />
                          </button>
                        </div>

                        <div
                          className="cart-item__variation-model"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {Object.keys(item.selectedOptions).some(
                            (key) => item.selectedOptions[key] === null
                          ) ? (
                            <>
                              {item.selectedOptions &&
                                Object.keys(item.selectedOptions).map(
                                  (optionKey, index) => (
                                    <div key={index}>
                                      {item.selectedOptions[optionKey]}
                                      {index <
                                        Object.keys(item.selectedOptions)
                                          .length -
                                        1 && ""}
                                    </div>
                                  )
                                )}
                            </>
                          ) : (
                            <>
                              {item.selectedOptions &&
                                Object.keys(item.selectedOptions).map(
                                  (optionKey, index) => (
                                    <div key={index}>
                                      {item.selectedOptions[optionKey]}
                                      {index <
                                        Object.keys(item.selectedOptions)
                                          .length -
                                        1 && ","}
                                    </div>
                                  )
                                )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="cart-item__price">
                        <div className="cart-item__price-old">₫396.000</div>
                        <div className="cart-item__price-current">
                          {currency(item.price, {
                            separator: ".",
                            decimal: ",",
                            symbol: "",
                          }).format()}
                          ₫
                        </div>
                      </div>
                      <div className="shop__qnt-btns">
                        <button
                          className="shop__qnt-btn shop__qnt-btn--dec"
                          onClick={() =>
                            dispatch(
                              decreaseCount({
                                id: item.id,
                                selectedOptions: item.selectedOptions,
                                userId: userId,
                              })
                            )
                          }
                        >
                          <i className="shop__qnt-btn-icon fas fa-minus" />
                        </button>
                        <input
                          className="shop__qnt-input"
                          type="text"
                          defaultValue={1}
                          maxLength={4}
                          value={item.count}
                        />
                        <button
                          className="shop__qnt-btn shop__qnt-btn--inc"
                          onClick={() =>
                            dispatch(
                              increaseCountCart({
                                id: item.id,
                                selectedOptions: item.selectedOptions,
                                userId: userId,
                              })
                            )
                          }
                        >
                          <i className="shop__qnt-btn-icon fas fa-plus" />
                        </button>
                      </div>
                      <div className="cart-item__price-total">
                        {currency(item.price * item.count, {
                          separator: ".",
                          decimal: ",",
                          symbol: "",
                        }).format()}
                        ₫
                      </div>
                      <div className="cart-item__actions">
                        <button
                          className="cart-item__action-remove"
                          onClick={() =>
                            dispatch(
                              removeOneFromCart({
                                id: item.id,
                                selectedOptions: item.selectedOptions,
                                userId: userId,
                              })
                            )
                          }
                          style={{ marginLeft: 50 }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="cart-item-container-mobile"></div>
              </div>
            </div>
          </div>
        ))}
        {/* Cart page footer */}
        <div className="cart-page-footer">
          {/* <div class="cart-page-footer__row3">
              <div class="cart-page-footer__actions">
                  <div id="shop-checkbox-all" class="shop-checkbox">
                      <input class="shop-checkbox__input" type="checkbox">
                          <div class="shop-checkbox__bgc"></div>
                  </div>
                  <button class="cart-page-footer__actions-btn cart-page-footer__select-all clear-btn">Chọn tất cả (<span class="qnt">0</span>)</button>
                  <button class="cart-page-footer__actions-btn cart-page-footer__remove clear-btn">Xóa</button>
                  <button class="cart-page-footer__actions-btn cart-page-footer__save clear-btn">Lưu vào mục Đã thích</button>
              </div>

              <div class="cart-page-footer__summary">
                  <div class="cart-page-footer__summary-total">
                      <div class="cart-page-footer__summary-total-text">Tổng tiền hàng (<span class="qnt">0</span> sản phẩm):</div>
                      <div class="cart-page-footer__summary-total-amount">₫0</div>
                  </div>
                  <div class="cart-page-footer__summary-bonus">Nhận thêm: 0 Xu</div>
              </div>

              <button class="cart-page-footer__checkout clear-btn">Mua Hàng</button>
          </div> */}
          <div className="cart-page-footer__row3">
            <div className="cart-page-footer__actions">
              <div id="shop-checkbox-all" className="shop-checkbox">
                <input className="shop-checkbox__input" type="checkbox" />
                <div className="shop-checkbox__bgc" />
              </div>
              <button className="cart-page-footer__actions-btn cart-page-footer__select-all clear-btn">
                Tất cả
                <span className="hide-on-mobile-tablet">
                  (<span className="qnt">2</span>)
                </span>
              </button>
              <button className="cart-page-footer__actions-btn cart-page-footer__remove clear-btn hide-on-mobile-tablet">
                Xóa
              </button>
              <button className="cart-page-footer__actions-btn cart-page-footer__save clear-btn hide-on-mobile-tablet">
                Lưu vào mục Đã thích
              </button>
            </div>
            <div className="cart-page-footer__summary">
              <div className="cart-page-footer__summary-total">
                <div className="cart-page-footer__summary-total-text">
                  Tổng tiền
                  <span className="hide-on-mobile-tablet">
                    (<span className="qnt">{totalItems}</span> sản phẩm):
                  </span>
                </div>
                {isChecked && (
                  <div className="cart-page-footer__summary-total-amount">
                    {currency(total, {
                      symbol: "",
                      separator: ".",
                      decimal: ",",
                    }).format()}
                    ₫
                  </div>
                )}
              </div>
            </div>
            <button
              className="cart-page-footer__checkout clear-btn"
              onClick={handleCheckout}
            >
              Mua hàng
            </button>
          </div>
        </div>
        {/* Confirm deletion */}
        <div className="confirm-deletion-container">
          <div className="confirm-deletion-overlay" />
          <div className="confirm-deletion">
            <div className="confirm-deletion__message">
              Bạn có muốn xóa <span className="qnt">0</span> sản phẩm?
            </div>
            <div className="confirm-deletion__btn-wrapper">
              <button className="confirm-deletion__btn confirm-deletion__btn--back clear-btn">
                Trở lại
              </button>
              <button className="confirm-deletion__btn confirm-deletion__btn--agree clear-btn">
                Có
              </button>
            </div>
          </div>
        </div>
        {/* Empty cart */}
        <div className="empty-cart">
          <div className="empty-cart__img" />
          <div className="empty-cart__msg">Giỏ hàng của bạn còn trống</div>
          <a href="index.html" className="empty-cart__link">
            <button className="empty-cart__link-btn clear-btn">MUA NGAY</button>
          </a>
        </div>
        {/* Cart carousel */}
        <div className="cart-page-carousel">
          <div className="cart-page-line" />
          <div className="cart-page-carousel__items">
            <div className="cart-page-carousel__title">
              Có thể bạn cũng thích
            </div>
            <button
              className="cart-page-carousel__items-btn cart-page-carousel__items-btn--prev clear-btn"
              style={{ display: "none" }}
            >
              <i className="fas fa-chevron-left" />
            </button>
            <button
              className="cart-page-carousel__items-btn cart-page-carousel__items-btn--next clear-btn"
              style={{ display: "block" }}
            >
              <i className="fas fa-chevron-right" />
            </button>
            <div className="cart-page-carousel-hidden">
              <div className="cart-page-carousel-container">
                <div className="cart-page-carousel__item-wrapper">
                  <a href="#" className="cart-page-carousel__item">
                    <div className="cart-page-carousel__item-img-wrapper">
                      <img
                        className="cart-page-carousel__item-img"
                        src={require("../../Images/ao1mattruoc.png")}
                      />
                    </div>
                    <div className="product-favourite">Yêu thích</div>
                    <div className="product-sale-off">
                      <span className="product-sale-off__percent">32%</span>
                      <span className="product-sale-off__label">GIẢM</span>
                    </div>
                    <div className="cart-page-carousel__item-container">
                      <div className="cart-page-carousel__item-name">
                        Trọn bộ Stiker Minecraft Education Edition
                      </div>
                      <div className="cart-page-carousel__item-bottom">
                        <div className="cart-page-carousel__item-price">
                          ₫5.900
                        </div>
                        <div className="cart-page-carousel__item-sold">
                          41 đã bán
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="cart-page-carousel__item-wrapper">
                  <a href="#" className="cart-page-carousel__item">
                    <div className="cart-page-carousel__item-img-wrapper">
                      <img
                        className="cart-page-carousel__item-img"
                        src={require("../../Images/ao2mattruoc.png")}
                      />
                    </div>
                    <div className="product-favourite">Yêu thích</div>
                    <div className="product-sale-off">
                      <span className="product-sale-off__percent">17%</span>
                      <span className="product-sale-off__label">GIẢM</span>
                    </div>
                    <div className="cart-page-carousel__item-container">
                      <div className="cart-page-carousel__item-name">
                        Móc khóa lợn bám bùn Minecraft Earth
                      </div>
                      <div className="cart-page-carousel__item-bottom">
                        <div className="cart-page-carousel__item-price">
                          ₫9.900
                        </div>
                        <div className="cart-page-carousel__item-sold">
                          44 đã bán
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="cart-page-carousel__item-wrapper">
                  <a href="#" className="cart-page-carousel__item">
                    <div className="cart-page-carousel__item-img-wrapper">
                      <img
                        className="cart-page-carousel__item-img"
                        src={require("../../Images/ao3mattruoc.png")}
                      />
                    </div>
                    <div className="product-favourite">Yêu thích</div>
                    <div className="product-sale-off">
                      <span className="product-sale-off__percent">21%</span>
                      <span className="product-sale-off__label">GIẢM</span>
                    </div>
                    <div className="cart-page-carousel__item-container">
                      <div className="cart-page-carousel__item-name">
                        Bộ ghim cừu Minecraft MINECON Earth 2018
                      </div>
                      <div className="cart-page-carousel__item-bottom">
                        <div className="cart-page-carousel__item-price">
                          ₫10.000
                        </div>
                        <div className="cart-page-carousel__item-sold">
                          12 đã bán
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="cart-page-carousel__item-wrapper">
                  <a href="#" className="cart-page-carousel__item">
                    <div className="cart-page-carousel__item-img-wrapper">
                      <img
                        className="cart-page-carousel__item-img"
                        src={require("../../Images/ao4mattruoc.png")}
                      />
                    </div>
                    <div className="product-favourite">Yêu thích</div>
                    <div className="product-sale-off">
                      <span className="product-sale-off__percent">15%</span>
                      <span className="product-sale-off__label">GIẢM</span>
                    </div>
                    <div className="cart-page-carousel__item-container">
                      <div className="cart-page-carousel__item-name">
                        Áo thun ngắn Steve và Alex khám phá đại dương Minecraft
                      </div>
                      <div className="cart-page-carousel__item-bottom">
                        <div className="cart-page-carousel__item-price">
                          ₫120.000
                        </div>
                        <div className="cart-page-carousel__item-sold">
                          124 đã bán
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="cart-page-carousel__item-wrapper">
                  <a href="#" className="cart-page-carousel__item">
                    <div className="cart-page-carousel__item-img-wrapper">
                      <img
                        className="cart-page-carousel__item-img"
                        src={require("../../Images/ao5mattruoc.png")}
                      />
                    </div>
                    <div className="product-favourite">Yêu thích</div>
                    <div className="product-sale-off">
                      <span className="product-sale-off__percent">55%</span>
                      <span className="product-sale-off__label">GIẢM</span>
                    </div>
                    <div className="cart-page-carousel__item-container">
                      <div className="cart-page-carousel__item-name">
                        Hộp ăn trưa gia đình Miner
                      </div>
                      <div className="cart-page-carousel__item-bottom">
                        <div className="cart-page-carousel__item-price">
                          ₫210.000
                        </div>
                        <div className="cart-page-carousel__item-sold">
                          351 đã bán
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="cart-page-carousel__item-wrapper">
                  <a href="#" className="cart-page-carousel__item">
                    <div className="cart-page-carousel__item-img-wrapper">
                      <img
                        className="cart-page-carousel__item-img"
                        src={require("../../Images/ao5mattruoc.png")}
                      />
                    </div>
                    <div className="product-favourite">Yêu thích</div>
                    <div className="product-sale-off">
                      <span className="product-sale-off__percent">62%</span>
                      <span className="product-sale-off__label">GIẢM</span>
                    </div>
                    <div className="cart-page-carousel__item-container">
                      <div className="cart-page-carousel__item-name">
                        Ly gốm mặt gà Minecraft màu trắng
                      </div>
                      <div className="cart-page-carousel__item-bottom">
                        <div className="cart-page-carousel__item-price">
                          ₫95.000
                        </div>
                        <div className="cart-page-carousel__item-sold">
                          1112 đã bán
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="cart-page-carousel__item-wrapper">
                  <a href="#" className="cart-page-carousel__item">
                    <div className="cart-page-carousel__item-img-wrapper">
                      <img
                        className="cart-page-carousel__item-img"
                        src="https://cdn.shopify.com/s/files/1/0266/4841/2351/products/886388162130Minecraft-Green-Grass-Storage-Bin-with-Lid-Merch-1-7_1800x1800.jpg?v=1612801808"
                      />
                    </div>
                    <div className="product-favourite">Yêu thích</div>
                    <div className="product-sale-off">
                      <span className="product-sale-off__percent">11%</span>
                      <span className="product-sale-off__label">GIẢM</span>
                    </div>
                    <div className="cart-page-carousel__item-container">
                      <div className="cart-page-carousel__item-name">
                        Túi cỏ xanh có nắp đa chức năng Minecraft
                      </div>
                      <div className="cart-page-carousel__item-bottom">
                        <div className="cart-page-carousel__item-price">
                          ₫310.000
                        </div>
                        <div className="cart-page-carousel__item-sold">
                          152 đã bán
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="cart-page-carousel__item-wrapper">
                  <a href="#" className="cart-page-carousel__item">
                    <div className="cart-page-carousel__item-img-wrapper">
                      <img
                        className="cart-page-carousel__item-img"
                        src="https://cdn.shopify.com/s/files/1/0266/4841/2351/products/MCJM-BDOMN-100002-MF_1800x1800.png?v=1614028381"
                      />
                    </div>
                    <div className="product-favourite">Yêu thích</div>
                    <div className="product-sale-off">
                      <span className="product-sale-off__percent">11%</span>
                      <span className="product-sale-off__label">GIẢM</span>
                    </div>
                    <div className="cart-page-carousel__item-container">
                      <div className="cart-page-carousel__item-name">
                        Áo len thun có mũ Dân làng ác Minecraft
                      </div>
                      <div className="cart-page-carousel__item-bottom">
                        <div className="cart-page-carousel__item-price">
                          ₫110.000
                        </div>
                        <div className="cart-page-carousel__item-sold">
                          2 đã bán
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="cart-page-carousel__item-wrapper">
                  <a href="#" className="cart-page-carousel__item">
                    <div className="cart-page-carousel__item-img-wrapper">
                      <img
                        className="cart-page-carousel__item-img"
                        src="https://cdn.shopify.com/s/files/1/0266/4841/2351/products/32281163907-1_1800x1800.jpg?v=1611683523"
                      />
                    </div>
                    <div className="product-favourite">Yêu thích</div>
                    <div className="product-sale-off">
                      <span className="product-sale-off__percent">12%</span>
                      <span className="product-sale-off__label">GIẢM</span>
                    </div>
                    <div className="cart-page-carousel__item-container">
                      <div className="cart-page-carousel__item-name">
                        Set đồ ngủ Minecraft 3 cái
                      </div>
                      <div className="cart-page-carousel__item-bottom">
                        <div className="cart-page-carousel__item-price">
                          ₫255.000
                        </div>
                        <div className="cart-page-carousel__item-sold">
                          33 đã bán
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="toast-msg-container"></div>
    </div>
  );
};

export default Cart;
