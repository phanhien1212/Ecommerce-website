import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const LayoutSite = () => {
  return (
    <>
      <div class="app">
        <Header />
        <Outlet />
        <Footer />
        <div id="fb-root"></div>
        <script
          async
          defer
          crossorigin="anonymous"
          src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v19.0&appId=3382654391946889"
          nonce="CkduKJc9"
        ></script>
      </div>
    </>
  );
};

export default LayoutSite;
