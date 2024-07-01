import ListCategory from "../pages/backend/Category/ListCategory.js";
import ShowCategory from "../pages/backend/Category/ShowCategory.js";
import TrashCategory from "../pages/backend/Category/TrashCategory.js";
import ListProduct from "../pages/backend/Product/ListProduct.js";
import ListContact from "../pages/backend/Contact/ListContact";
import ReplyContact from "../pages/backend/Contact/ReplyContact";
import ShowContact from "../pages/backend/Contact/ShowContact";
import TrashContact from "../pages/backend/Contact/TrashContact";
import ListCustomer from "../pages/backend/Customer/ListCustomer.js";
import ListSeller from "../pages/backend/Seller/ListSeller.js";
import EditSeller from "../pages/backend/Seller/EditSeller.js";
import TrashSeller from "../pages/backend/Seller/TrashSeller.js";
import EditCategory from "../pages/backend/Category/EditCategory.js";
import ListUser from "../pages/backend/User/ListUser.js";
import TrashUser from "../pages/backend/User/TrashUser.js";
import EditUser from "../pages/backend/User/EditUser.js";
import CreateUser from "../pages/backend/User/CreateUser.js";
import ProductShow from "../pages/backend/Product/ProductShow.js";
import ListProductWaitting from "../pages/backend/Product/ListProductWaitting.js";
import RankingCategorySeller from "../pages/backend/BusinessPerformance/RankingCategorySeller.js";
import ListPage from "./../pages/backend/Page/ListPage";
import ListRevenueStatistics from "./../pages/backend/RevenueStatistics/ListRevenueStatistics";
import ListBanner from "./../pages/backend/Banner/ListBanner";
import CreateBanner from "./../pages/backend/Banner/CreateBanner";
import TrashBanner from "./../pages/backend/Banner/TrashBanner";
import EditBanner from "./../pages/backend/Banner/EditBanner";
import ListTopic from "./../pages/backend/Topic/ListTopic";
import EditTopic from "./../pages/backend/Topic/EditTopic";
import CreatePage from "../pages/backend/Page/CreatePage.js";
import EditPage from "./../pages/backend/Page/EditPage";
import ListProductViolate from "../pages/backend/Product/ListProductViolate.js";
import ShowCustomer from "../pages/backend/Customer/ShowCustomer.js";
import ShowSeller from "../pages/backend/Seller/ShowSeller.js";
import ShowUser from "../pages/backend/User/ShowUser.js";
import ShowPage from "../pages/backend/Page/ShowPage.js";
import AdvertisementAdmin from "../pages/backend/BusinessPerformance/Advertisement.js";

const routerAdmin = [
  { path: "/admin/product/", component: ListProduct },
  { path: "/admin/productwaitting/", component: ListProductWaitting },
  { path: "/admin/productviolate/", component: ListProductViolate },
  { path: "/admin/category/", component: ListCategory },
  { path: "/admin/category/edit/:id", component: EditCategory },
  { path: "/admin/category/show/:id", component: ShowCategory },
  { path: "/admin/category/trash/", component: TrashCategory },
  { path: "/admin/contact/", component: ListContact },
  { path: "/admin/contact/reply/:id", component: ReplyContact },
  { path: "/admin/product/:id", component: ProductShow },
  { path: "/admin/contact/show/:id", component: ShowContact },
  { path: "/admin/contact/trash", component: TrashContact },
  { path: "/admin/banner/", component: ListBanner },
  { path: "/admin/banner/create", component: CreateBanner },
  { path: "/admin/banner/edit/:id", component: EditBanner },
  { path: "/admin/banner/trash", component: TrashBanner },
  { path: "/admin/customer/", component: ListCustomer },
  { path: "/admin/page/", component: ListPage },
  { path: "/admin/page/:id", component: ShowPage },
  { path: "/admin/page/create", component: CreatePage },
  { path: "/admin/page/edit/:id", component: EditPage },
  { path: "/admin/customer/:id", component: ShowCustomer },
  { path: "/admin/seller/", component: ListSeller },
  { path: "/admin/seller/:id", component: ShowSeller },
  { path: "/admin/seller/edit/:id", component: EditSeller },
  { path: "/admin/seller/trash", component: TrashSeller },
  { path: "/admin/topic/", component: ListTopic },
  { path: "/admin/topic/edit/:id", component: EditTopic },
  { path: "/admin/user", component: ListUser },
  { path: "/admin/user/trash", component: TrashUser },
  { path: "/admin/user/edit/:id", component: EditUser },
  { path: "/admin/user/:id", component: ShowUser },
  { path: "/admin/businessperformance", component: RankingCategorySeller },
  { path: "/admin/advertisment", component: AdvertisementAdmin },
  { path: "/admin/user/create/", component: CreateUser },
  { path: "/admin/revenuestatistics/", component: ListRevenueStatistics },
];

export default routerAdmin;
