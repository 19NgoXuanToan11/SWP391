import "./global.css";
import { SiteHeader } from "../src/pages/users/header/site-header";
import { SiteFooter } from "../src/pages/users/footer/site-footer";
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { store } from "./store/rootReducer";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Theo dõi sự thay đổi trang và kiểm tra quyền
  useEffect(() => {
    const normalizedPath =
      pathname.endsWith("/") && pathname !== "/"
        ? pathname.slice(0, -1)
        : pathname;

    // Nếu chuyển từ trang admin sang trang thường
    if (
      normalizedPath === "/" ||
      (!normalizedPath.includes("/dashboard") &&
        !normalizedPath.includes("/admin") &&
        !normalizedPath.includes("/login"))
    ) {
      const isAdminLoggedIn = localStorage.getItem("isAdmin") === "true";
      const previousPage = sessionStorage.getItem("previousPage");

      // Nếu trước đó đang ở trang admin và hiện tại là trang người dùng
      if (
        previousPage &&
        (previousPage.includes("/dashboard") ||
          previousPage.includes("/admin")) &&
        isAdminLoggedIn
      ) {
        // Đăng xuất admin khi chuyển sang trang người dùng thông thường
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_sessionId");
        localStorage.removeItem("auth_isAdmin");
        localStorage.removeItem("auth_mode");

        // Để tránh chuyển hướng liên tục, thêm flag để đánh dấu đã xử lý
        sessionStorage.setItem("adminLogoutProcessed", "true");

        // Tải lại trang để cập nhật trạng thái ứng dụng
        window.location.reload();
      }
    } else {
      // Reset flag khi không ở trang chủ
      sessionStorage.removeItem("adminLogoutProcessed");
    }

    // Lưu trang hiện tại vào session storage
    sessionStorage.setItem("previousPage", normalizedPath);
  }, [pathname, navigate]);

  // Chuẩn hóa pathname để loại bỏ dấu / ở cuối nếu có
  const normalizedPathname =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  // Paths that shouldn't include the header and footer
  const noHeaderFooterPaths = [
    "/login",
    "/register",
    "/admin",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/staff/login",
    "/staff/orders",
    "/staff/notifications",
  ];

  // Thêm kiểm tra role khi chuyển giữa các trang
  const isAdminRoute = (path) => {
    return path.startsWith("/admin/");
  };

  // Kiểm tra với pathname đã được chuẩn hóa
  const shouldShowHeaderFooter = !noHeaderFooterPaths.some(
    (path) =>
      normalizedPathname === path || normalizedPathname.startsWith(`${path}/`)
  );

  // Thêm vào component App
  useEffect(() => {
    // Đồng bộ giỏ hàng khi người dùng đăng nhập
    const handleUserLogin = () => {
      const userStr = localStorage.getItem("auth_user");
      if (userStr) {
        try {
          const currentUser = JSON.parse(userStr);
          const userId = currentUser.id;
          const allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};

          if (allCarts[userId]) {
            // Dispatch action để cập nhật giỏ hàng
            store.dispatch({
              type: "cart/setCart",
              payload: allCarts[userId],
            });
          }

          // Tương tự cho wishlist
          const allWishlists =
            JSON.parse(localStorage.getItem("allWishlists")) || {};
          if (allWishlists[userId]) {
            store.dispatch({
              type: "wishlist/setWishlist",
              payload: allWishlists[userId],
            });
          }
        } catch (error) {
          console.error("Error syncing cart on login:", error);
        }
      }
    };

    // Lắng nghe sự kiện đăng nhập
    window.addEventListener("userLoggedIn", handleUserLogin);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLogin);
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId="463920300061-6bepsjbm7fv2pfb816h4qv1sh5m9p1ec.apps.googleusercontent.com">
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
    </GoogleOAuthProvider>
  );
}

export default App;
