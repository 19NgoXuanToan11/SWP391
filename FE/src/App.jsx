import "./global.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { Outlet } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import { useLocation } from "react-router-dom";
<<<<<<< Updated upstream
import { VerifyEmailPage } from "./pages/login/verifyEmailPage";
=======
>>>>>>> Stashed changes

function App() {
  const { pathname } = useLocation();

  // Paths that shouldn't include the header and footer
  const noHeaderFooterPaths = [
    "/login",
    "/register",
    "/dashboard",
    "/account",
    "/order",
    "/category",
    "/brand",
    "/voucher",
    "/setting",
    "/abouts",
<<<<<<< Updated upstream
    "/verify-email",
=======
>>>>>>> Stashed changes
  ];

  const shouldShowHeaderFooter = !noHeaderFooterPaths.includes(pathname);

  return (
    <div className="App">
      {shouldShowHeaderFooter && <SiteHeader />}
      <main>
        <ScrollRestoration />
        <Outlet />
      </main>
      {shouldShowHeaderFooter && <SiteFooter />}
    </div>
  );
}

export default App;
