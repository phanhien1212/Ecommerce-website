
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routerApp from './router';
import LayoutSite from './layouts/LayoutSite';
import './CSS/base.css';
import './CSS/main.css';
import './CSS/grid.css';
import './CSS/responsive.css';
import './CSS/product-info.css';
import './CSS/product-cart.css';
import './CSS/account.css';
import './CSS/order.css';
import './fonts/fontawesome-free-6.1.1/css/all.min.css';
import LayoutAdmin from './layouts/LayoutAdmin';
import ChannelSeller from './layouts/ChannelSeller';
import store from '../src/state/store.js';
import { Provider } from 'react-redux';
import Account from './layouts/Account/index';
import routerAccount from './router/routerAccount';

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/seller" element={<ChannelSeller />}>
          {routerApp.routerSeller.map((route, index) => {
            const Page = route.component;
            return <Route path={route.path} element={<Page />} key={index} />
          })}
        </Route>
        <Route path="/admin" element={<LayoutAdmin />}>
          {routerApp.routerAdmin.map((route, index) => {
            const Page = route.component;
            return <Route path={route.path} element={<Page />} key={index} />
          })}
        </Route>
        <Route path="/" element={<LayoutSite />}>
          {routerApp.routerSite.map((route, index) => {
            const Page = route.component;
            return <Route path={route.path} element={<Page />} key={index} />
          })}
        </Route>
        <Route path="/acc" element={<Account />}>
          {routerApp.routerAccount.map((route, index) => {
            const Page = route.component;
            return <Route path={route.path} element={<Page />} key={index} />
          })}
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
