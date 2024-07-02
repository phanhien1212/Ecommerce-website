
import Account from "../pages/frontend/Account.js";
import Cart from "../pages/frontend/Cart";
import Checkout from "../pages/frontend/Checkout.js";
import PayPal from "../pages/frontend/PayPal.js";
import Home from "../pages/frontend/Home";
import Order from "../pages/frontend/Order.js";
import ProductDetail from "../pages/frontend/ProductDetail.js";
import Address from "../pages/frontend/Address.js";
import SuccessDelivery from "../pages/frontend/SuccessDelivery.js";
import WaitingDelivery from "../pages/frontend/WaitingDelivery.js";
import PageDetail from "../pages/frontend/PageDetail.js";
import Shop from "../pages/frontend/Shop.js";
import FavoriteProduct from "../pages/frontend/FavoriteProduct.js";
import FlashSale from "../pages/frontend/FlashSale.js";
import ChangePassword from "../pages/frontend/ChangePassword.js";
import SearchProduct from "../pages/frontend/SearchProduct.js";
import Login from "../pages/frontend/Login.js";
import Pay from "../pages/frontend/Pay.js";
import ProductByCategory from './../pages/frontend/ProductByCatgory';
import Chat from "../pages/frontend/Chat.js";
import OrderDetail from "../pages/frontend/Home/OrderDetail.js";
import OrderWaitting from "../pages/frontend/OrderWaitting.js";
import OrderPrepare from "../pages/frontend/OrderPrepare.js";
import OrderShipping from "../pages/frontend/OrderShipping.js";
import OrderCompleted from "../pages/frontend/OrderCompleted.js";
import OrderCancel from "../pages/frontend/OrderCancel.js";
import OrderReturn from "../pages/frontend/OrderReturn.js";
import ChatSeller from './../pages/frontend/ChatSeller';

const routerSite = [
  { path: '/', component: Home },
  { path: '/product-detail/:slug', component: ProductDetail },
  { path: '/cart', component: Cart },
  { path: '/account', component: Account },
  { path: '/address', component: Address },
  { path: '/order', component: Order },
  { path: '/orderwaitting', component: OrderWaitting },
  { path: '/orderprepare', component: OrderPrepare },
  { path: '/ordershipping', component:  OrderShipping},
  { path: '/ordercompleted', component:  OrderCompleted},
  { path: '/orderreturn', component:  OrderReturn},
  { path: '/ordercancel', component:  OrderCancel},
  { path: '/productbycategory/:id', component: ProductByCategory },
  { path: '/success-delivery', component: SuccessDelivery },
  { path: '/waiting-delivery', component: WaitingDelivery },
  { path: '/checkout', component: Checkout },
  { path: '/paypal', component: PayPal },
  { path: '/page-detail/:id', component: PageDetail },
  { path: '/shop/:id', component: Shop },
  { path: '/favorite-product', component: FavoriteProduct },
  { path: '/flash-sale', component: FlashSale },
  { path: '/change-password', component: ChangePassword },
  { path: '/search-product', component: SearchProduct },
  { path: '/login', component: Login},
  { path: '/pay', component: Pay},
  { path: '/chat', component: Chat},
  { path: '/orderdetail/:id', component: OrderDetail},
  { path: '/chat/:id', component: ChatSeller},
];


export default routerSite;
