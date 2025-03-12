import "./global.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { VerifyEmailPage } from "./pages/login/verifyEmailPage";
import { AuthProvider } from "./components/auth/AuthProvider";

function App() {
  const { pathname } = useLocation();

  // Chuẩn hóa pathname để loại bỏ dấu / ở cuối nếu có
  const normalizedPathname =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

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
    "/verify-email",
    "/admin/login",
    "/forgot-password"
  ];

  // Kiểm tra với pathname đã được chuẩn hóa
  const shouldShowHeaderFooter = !noHeaderFooterPaths.some(
    (path) =>
      normalizedPathname === path || normalizedPathname.startsWith(`${path}/`)
  );

  return (
    <AuthProvider>
      <div className="App">
        {shouldShowHeaderFooter && <SiteHeader />}
        <main>
          <ScrollRestoration />
          <Outlet />
        </main>
        {shouldShowHeaderFooter && <SiteFooter />}
      </div>
    </AuthProvider>
  );
}

export default App;
