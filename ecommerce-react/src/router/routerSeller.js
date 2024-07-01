import ListCustomerSeller from "../pages/backendseller/Customer/ListCustomerSeller";
import ListOrderSeller from "../pages/backendseller/Order/ListOrderSeller";
import CreateProductSeller from "../pages/backendseller/Product/CreateProductSeller";
import EditProductSeller from "../pages/backendseller/Product/EditProductSeller";
import TrashProductSeller from "../pages/backendseller/Product/TrashProductSeller";
import ListUserSeller from "../pages/backendseller/User/ListUserSeller";
import ListProductSeller from "./../pages/backendseller/Product/AllListProductSeller";
import ProductActive from "./../pages/backendseller/Product/ProductActive";
import ProductOutStock from "./../pages/backendseller/Product/ProductOutStock";
import ProductWaitting from "./../pages/backendseller/Product/ProductWaitting";
import ProductViolate from "./../pages/backendseller/Product/ProductViolate";
import ProductHidden from "./../pages/backendseller/Product/ProductHidden";
import OrderDetail from "../pages/backendseller/Order/OrderDetail";
import FlashSale from "../pages/backendseller/Marketing/FlashSale";
import Advertisement from "../pages/backendseller/Marketing/Advertisement";
import ProfileShop from "../pages/backendseller/ShopProfile/ProfileStore";
import ProfileShopUpdate from "../pages/backendseller/ShopProfile/ProfileStoreUpdate";
import QuangCao from "../pages/backendseller/Marketing/QuangCao";
import CreateAdvertisement from "../pages/backendseller/Marketing/CreateAdvertisement";
import TopUpAdvertisement from "../pages/backendseller/Marketing/TopUpAdvertisement";
import CheckoutTopUp from "../pages/backendseller/Marketing/CheckoutTopUp";
import PayPalSeller from "../pages/backendseller/Marketing/PayPalSeller";
import PaypalAdvertising from "../pages/frontend/PayPalAdvertising";
import WaitingOrderSeller from "../pages/backendseller/Order/WaitingOrderSeller";
import PrepareOrderSeller from "../pages/backendseller/Order/PrepareOrderSeller";
import ShippingOrderSeller from "../pages/backendseller/Order/ShippingOrderSeller";
import CompletedOrderSelle from "../pages/backendseller/Order/CompletedOrderSeller";
import ListRevenueStatisticssSeller from "../pages/backendseller/Home";
import CancelOrderSeller from "../pages/backendseller/Order/CancelOrderSeller";
import ReturnOrderSeller from "../pages/backendseller/Order/ReturnOrderSeller.js";

const routerSeller = [
  { path: "/seller/productseller/:id", component: ListProductSeller },
  { path: "/seller", component: ListRevenueStatisticssSeller },
  { path: "/seller/productseller/productactive", component: ProductActive },
  { path: "/seller/productseller/productoutstock", component: ProductOutStock },
  { path: "/seller/productseller/productwaitting", component: ProductWaitting },
  { path: "/seller/productseller/productviolate", component: ProductViolate },
  { path: "/seller/productseller/producthidden", component: ProductHidden },
  { path: "/seller/product/create", component: CreateProductSeller },
  { path: "/seller/product/edit/:id", component: EditProductSeller },
  { path: "/seller/product/trash", component: TrashProductSeller },
  { path: "/seller/orderseller/:id", component: ListOrderSeller },
  { path: "/seller/orderseller/waitting/:id", component: WaitingOrderSeller },
  { path: "/seller/orderseller/prepare/:id", component: PrepareOrderSeller },
  { path: "/seller/orderseller/shipping/:id", component: ShippingOrderSeller },
  { path: "/seller/orderseller/completed/:id", component: CompletedOrderSelle },
  { path: "/seller/orderseller/cancel/:id", component: CancelOrderSeller },
  { path: "/seller/orderseller/return/:id", component: ReturnOrderSeller },
  { path: "/seller/orderseller/orderdetail/:id", component: OrderDetail },
  { path: "/seller/customer/", component: ListCustomerSeller },
  { path: "/seller/user/", component: ListUserSeller },
  { path: "/seller/marketing/flashsale", component: FlashSale },
  { path: "/seller/marketing/advertisement", component: QuangCao },
  { path: "/seller/marketing/topup", component: TopUpAdvertisement },
  { path: "/seller/marketing/checkouttopup", component: CheckoutTopUp },
  { path: "/seller/marketing/paypalseller", component: PayPalSeller },
  {
    path: "/seller/marketing/createadvertisement",
    component: CreateAdvertisement,
  },
  { path: "/seller/marketing/paypaladvertising", component: PaypalAdvertising },
  { path: "/seller/marketing/sale", component: Advertisement },
  { path: "/seller/shop/shopprofile", component: ProfileShop },
  { path: "/seller/shop/updateshopprofile", component: ProfileShopUpdate },
];

export default routerSeller;
