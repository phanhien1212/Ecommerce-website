import Complete from "../pages/backendseller/User/Complete";
import RegisterAccountSeller from "../pages/backendseller/User/RegisterAccountSeller";
import RegisterSeller from "../pages/backendseller/User/RegisterSeller";
import Login from "../pages/frontend/Home/Login";

const routerAccount = [
  { path: "/acc/login", component: Login },
  { path: "/acc/welcome-register", component: RegisterSeller },
  { path: "/acc/register", component: RegisterAccountSeller },
  { path: "/acc/complete", component: Complete },
];

export default routerAccount;
