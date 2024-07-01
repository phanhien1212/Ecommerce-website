import { MdFavoriteBorder } from "react-icons/md";
import "../../CSS/address.css"
import { PiAddressBook } from "react-icons/pi";
import { CgPassword } from "react-icons/cg";
const Address = () => {
    return (
        <div className="app__container">
            <div className="grid wide">
                <div className="row sm-gutter app__content">
                    <div className="col l-2 m-0 c-0">
                        <div className="category-pc">
                            <nav className="category">
                                <div className="AmWkJQ">
                                    <a className="_1O4r+C" href="/user/account/profile">
                                        <div className="shopee-avatar">
                                            <img className="shopee-avatar__img" src="https://down-vn.img.susercontent.com/file/a2f5c23b58a9c5fcd53233ee88aaf225_tn" />
                                        </div>
                                    </a>
                                    <div className="miwGmI" style={{ marginLeft: 20 }}>
                                        <div className="mC1Llc">bzzlnmtm6_</div>
                                        <div>
                                            <a className="_78QHr1" href="/user/account/profile">
                                                <svg width={12} height={12} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 4 }}>
                                                    <path d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48" fill="#9B9B9B" fillRule="evenodd" />
                                                </svg>Sửa hồ sơ</a>
                                        </div>
                                    </div>
                                </div>

                                {/* Content category items */}
                                <ul className="category-list" style={{ marginTop: 10, marginLeft: -5 }}>
                                    <li className="category-item " >
                                        <div className="category-ac-item__icon">
                                            <img style={{ width: 20 }} src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"></img>
                                        </div>
                                        <a href="/account" style={{ marginLeft: 6 }} className="category-item__link">Hồ sơ</a>

                                    </li>
                                    <li className="category-item">
                                        <div className="category-ac-item__icon ">
                                            <PiAddressBook style={{ color: "#0066CC", fontSize: 20 }} />
                                        </div>
                                        <a href="/address" style={{ marginLeft: 6 }} className="category-item__link">Địa chỉ</a>
                                    </li>
                                    <li className="category-item">
                                        <div className="category-ac-item__icon ">
                                            <img style={{ width: 20 }} src="https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078"></img>
                                        </div>
                                        <a href="/order" style={{ marginLeft: 6 }} className="category-item__link">Đơn mua</a>
                                    </li>
                                    <li className="category-item">
                                        <div className="category-ac-item__icon ">
                                            <MdFavoriteBorder style={{ fontSize: 20, color: "red" }} />
                                        </div>
                                        <a href="/favorite-product" style={{ marginLeft: 6 }} className="category-item__link">Sản phẩm yêu thích</a>
                                    </li>
                                    <li className="category-item">
                                        <div className="category-ac-item__icon ">
                                            <CgPassword style={{ fontSize: 20, color: "black" }} />
                                        </div>
                                        <a href="/change-password" style={{ marginLeft: 6 }} className="category-item__link">Đổi mật khẩu</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="col l-10 m-12 c-12 my-account" style={{ backgroundColor: "white" }}>
                        <div className="fkIi86">
                            <div className="CAysXD" role="main">
                                <div className="YTmAr0">
                                    <div className="qtYn7m">
                                        <div className="Oe_bEi">
                                            <div className="lOB9lY">
                                                Địa chỉ của tôi
                                            </div>
                                            <div className="rT9Vbd">
                                            </div>
                                        </div>
                                        <div>
                                            <div className="y3hZ9E">
                                                <div style={{ display: 'flex' }}>
                                                    <button className="shopee-button-solid shopee-button-solid--primary qTzF0g">
                                                        <div className="psXjeQ" data-bs-toggle="modal" data-bs-target="#exampleModal3">
                                                            <div className="zNqMl2">
                                                                <svg enableBackground="new 0 0 10 10" viewBox="0 0 10 10" x={0} y={0} className="shopee-svg-icon icon-plus-sign">
                                                                    <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5">
                                                                    </polygon>
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                Thêm địa chỉ mới
                                                            </div>
                                                        </div>
                                                    </button>

                                                    <div class="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div class="modal-dialog">
                                                            <div class="modal-content" style={{ marginTop: 90 }} >
                                                                <div className="h_K92g undefined">
                                                                    <div className="w3X3nN">
                                                                        <div className="ZrzEDE">
                                                                            Địa chỉ mới
                                                                        </div>
                                                                        <form>
                                                                            <div className="jypd7H">
                                                                                <div className="kTXLeO">
                                                                                    <div className="R1TwAI">
                                                                                        <div className="OanBpz Jl3DqQ">
                                                                                            <div className="t0HxU5">
                                                                                                <div className="rG6mJB">
                                                                                                    Họ và tên
                                                                                                </div>
                                                                                                <input className="AukTuV" type="text" placeholder="Họ và tên" maxLength={64} />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="FqyAgi">
                                                                                        </div>
                                                                                        <div className="OanBpz H7kyc3">
                                                                                            <div className="t0HxU5">
                                                                                                <div className="rG6mJB">
                                                                                                    Số điện thoại
                                                                                                </div>
                                                                                                <input className="AukTuV" type="text" placeholder="Số điện thoại" />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="R1TwAI">
                                                                                        <div className="hCKmck">
                                                                                            <div className="iP0OHO">
                                                                                                <div className="eOA8Kb">

                                                                                                    <input className="fmiIx2" type="text" placeholder="Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã" />

                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="R1TwAI">
                                                                                        <div className="XODmKx">
                                                                                            <div className="LzFExT U42F79 j_0_nc">
                                                                                                <div className="DHKqPc">
                                                                                                    <div className="cdREm2">
                                                                                                        Địa chỉ cụ thể
                                                                                                    </div>
                                                                                                    <textarea className="SvyEcF" rows={2} placeholder="Địa chỉ cụ thể" />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="DoWgsT">
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>


                                                                                    <div className="NlC19f">
                                                                                        <label className="_uXoWc">
                                                                                            <input className="sp7inB" type="checkbox" role="checkbox" aria-checked="false" aria-disabled="false" />
                                                                                            <div className="H4iGzY">
                                                                                            </div>
                                                                                            Đặt làm địa chỉ mặc đinh
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="Lr7eTF">
                                                                                    <button data-bs-toggle="modal" data-bs-target="#exampleModal3" className="zvyzwn Jp08En" >
                                                                                        Trở Lại
                                                                                    </button>
                                                                                    <button className="zvyzwn Dr0Xm6">
                                                                                        Hoàn thành
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="KK80cT">
                                        <div className="stardust-spinner--hidden stardust-spinner">
                                            <div className="stardust-spinner__background">
                                                <div className="stardust-spinner__main" role="img">
                                                    <svg width={34} height={12} viewBox="-1 0 33 12">
                                                        <circle className="stardust-spinner__spinner" cx={4} cy={6} r={4} fill="#EE4D2D">
                                                        </circle>
                                                        <circle className="stardust-spinner__spinner" cx={16} cy={6} r={4} fill="#EE4D2D">
                                                        </circle>
                                                        <circle className="stardust-spinner__spinner" cx={28} cy={6} r={4} fill="#EE4D2D">
                                                        </circle>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="OrZkCF">
                                            <div className="e65FdS">
                                                Địa chỉ
                                            </div>
                                            <div className="UUD4No SXp5o_">
                                                <div className="_RPpod">
                                                    <div role="heading" className="X57SfF V4So7f">
                                                        <div id="address-card_60f3af00-f025-4616-822f-0c62d16bff23_header" className="QyRpwQ lWXnp3">
                                                            <span className="Fi1zsg OwAhWT">
                                                                <div className="mjiDsj">
                                                                    Phan Hiển
                                                                </div>
                                                            </span>
                                                            <div className="YJU6OK">
                                                            </div>
                                                            <div role="row" className="N_WJUf lw_xYb E24UKj">
                                                                (+84) 941216276
                                                            </div>
                                                        </div>
                                                        <div className="YziUfM">
                                                            <button className="T_oZqJ">
                                                                Cập nhật
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="address-card_60f3af00-f025-4616-822f-0c62d16bff23_content" role="heading" className="X57SfF V4So7f">
                                                        <div className="QyRpwQ lWXnp3">
                                                            <div className="We6XvC">
                                                                <div role="row" className="E24UKj">
                                                                    Vinhome Grand Park, tòa s103, Nguyễn Xiển
                                                                </div>
                                                                <div role="row" className="E24UKj">
                                                                    Phường Long Thạnh Mỹ, Thành Phố Thủ Đức, TP. Hồ Chí Minh
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="KFu3R3 YziUfM">
                                                            <button className="k8tV5Y zvyzwn zDPndA" disabled>
                                                                Thiết lập mặc định
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="address-card_60f3af00-f025-4616-822f-0c62d16bff23_badge" role="row" className="vy2yND E24UKj">
                                                        <span role="mark" className="wZ_1w7 aCY_5O ZDVTqW">
                                                            Mặc định
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="UUD4No SXp5o_">
                                                <div className="_RPpod">
                                                    <div role="heading" className="X57SfF V4So7f">
                                                        <div id="address-card_5830d498-6f1f-4bb4-a102-a01962f03122_header" className="QyRpwQ lWXnp3">
                                                            <span className="Fi1zsg OwAhWT">
                                                                <div className="mjiDsj">
                                                                    Phan Hiển
                                                                </div>
                                                            </span>
                                                            <div className="YJU6OK">
                                                            </div>
                                                            <div role="row" className="N_WJUf lw_xYb E24UKj">
                                                                (+84) 941216276
                                                            </div>
                                                        </div>
                                                        <div className="YziUfM">
                                                            <button className="T_oZqJ">
                                                                Cập nhật
                                                            </button>
                                                            <button className="T_oZqJ">
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="address-card_5830d498-6f1f-4bb4-a102-a01962f03122_content" role="heading" className="X57SfF V4So7f">
                                                        <div className="QyRpwQ lWXnp3">
                                                            <div className="We6XvC">
                                                                <div role="row" className="E24UKj">
                                                                    51/21 lương ngọc quyến
                                                                </div>
                                                                <div role="row" className="E24UKj">
                                                                    Phường Phú Trinh, Thành Phố Phan Thiết, Bình Thuận
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="KFu3R3 YziUfM">
                                                            <button className="k8tV5Y zvyzwn zDPndA">
                                                                Thiết lập mặc định
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="address-card_5830d498-6f1f-4bb4-a102-a01962f03122_badge" role="row" className="vy2yND E24UKj">
                                                        <span role="mark" className="wZ_1w7 va0awL ZDVTqW">
                                                            Địa chỉ lấy hàng
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="UUD4No SXp5o_">
                                                <div className="_RPpod">
                                                    <div role="heading" className="X57SfF V4So7f">
                                                        <div id="address-card_b3b750d8-57c8-427c-aed8-eed452ad60e8_header" className="QyRpwQ lWXnp3">
                                                            <span className="Fi1zsg OwAhWT">
                                                                <div className="mjiDsj">
                                                                    Phan Hiển
                                                                </div>
                                                            </span>
                                                            <div className="YJU6OK">
                                                            </div>
                                                            <div role="row" className="N_WJUf lw_xYb E24UKj">
                                                                (+84) 941216276
                                                            </div>
                                                        </div>
                                                        <div className="YziUfM">
                                                            <button className="T_oZqJ">
                                                                Cập nhật
                                                            </button>
                                                            <button className="T_oZqJ">
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="address-card_b3b750d8-57c8-427c-aed8-eed452ad60e8_content" role="heading" className="X57SfF V4So7f">
                                                        <div className="QyRpwQ lWXnp3">
                                                            <div className="We6XvC">
                                                                <div role="row" className="E24UKj">
                                                                    51/21 hẻm Lương Ngọc Quyến,phường Phú Trinh,TP Phan Thiết
                                                                </div>
                                                                <div role="row" className="E24UKj">
                                                                    Phường Phú Trinh, Thành Phố Phan Thiết, Bình Thuận
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="KFu3R3 YziUfM">
                                                            <button className="k8tV5Y zvyzwn zDPndA">
                                                                Thiết lập mặc định
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="address-card_b3b750d8-57c8-427c-aed8-eed452ad60e8_badge" role="row" className="vy2yND E24UKj">
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="UUD4No SXp5o_">
                                                <div className="_RPpod">
                                                    <div role="heading" className="X57SfF V4So7f">
                                                        <div id="address-card_effcedef-9b48-4c8f-b138-5fc8426380a9_header" className="QyRpwQ lWXnp3">
                                                            <span className="Fi1zsg OwAhWT">
                                                                <div className="mjiDsj">
                                                                    Phương Vy
                                                                </div>
                                                            </span>
                                                            <div className="YJU6OK">
                                                            </div>
                                                            <div role="row" className="N_WJUf lw_xYb E24UKj">
                                                                (+84) 774255690
                                                            </div>
                                                        </div>
                                                        <div className="YziUfM">
                                                            <button className="T_oZqJ">
                                                                Cập nhật
                                                            </button>
                                                            <button className="T_oZqJ">
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="address-card_effcedef-9b48-4c8f-b138-5fc8426380a9_content" role="heading" className="X57SfF V4So7f">
                                                        <div className="QyRpwQ lWXnp3">
                                                            <div className="We6XvC">
                                                                <div role="row" className="E24UKj">
                                                                    Chung cư sống thần
                                                                </div>
                                                                <div role="row" className="E24UKj">
                                                                    Phường Dĩ An, Thành Phố Dĩ An, Bình Dương
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="KFu3R3 YziUfM">
                                                            <button className="k8tV5Y zvyzwn zDPndA">
                                                                Thiết lập mặc định
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="address-card_effcedef-9b48-4c8f-b138-5fc8426380a9_badge" role="row" className="vy2yND E24UKj">
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="UUD4No SXp5o_">
                                                <div className="_RPpod">
                                                    <div role="heading" className="X57SfF V4So7f">
                                                        <div id="address-card_09aa57cb-8e6c-4a97-9865-7484744911fd_header" className="QyRpwQ lWXnp3">
                                                            <span className="Fi1zsg OwAhWT">
                                                                <div className="mjiDsj">
                                                                    Phương Vi
                                                                </div>
                                                            </span>
                                                            <div className="YJU6OK">
                                                            </div>
                                                            <div role="row" className="N_WJUf lw_xYb E24UKj">
                                                                (+84) 774255690
                                                            </div>
                                                        </div>
                                                        <div className="YziUfM">
                                                            <button className="T_oZqJ">
                                                                Cập nhật
                                                            </button>
                                                            <button className="T_oZqJ">
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="address-card_09aa57cb-8e6c-4a97-9865-7484744911fd_content" role="heading" className="X57SfF V4So7f">
                                                        <div className="QyRpwQ lWXnp3">
                                                            <div className="We6XvC">
                                                                <div role="row" className="E24UKj">
                                                                    Chung Cư Sóng Thần, Độc Lập
                                                                </div>
                                                                <div role="row" className="E24UKj">
                                                                    Phường Bình Chiểu, Thành Phố Thủ Đức, TP. Hồ Chí Minh
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="KFu3R3 YziUfM">
                                                            <button className="k8tV5Y zvyzwn zDPndA">
                                                                Thiết lập mặc định
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="address-card_09aa57cb-8e6c-4a97-9865-7484744911fd_badge" role="row" className="vy2yND E24UKj">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>


    );
}

export default Address;