import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { HomePage } from "../pages/users/homePage";
import { LoginPage } from "../pages/login/loginPage";
import { RegisterPage } from "../pages/login/registerPage";
import { AboutPage } from "../pages/users/aboutPage";
import { ContactPage } from "../pages/users/contactPage";
import { ProductsPage } from "../pages/users/productPage";
import { QuizPage } from "../pages/users/quizPage";
import { QuizLandingPage } from "../pages/users/quizlandingPage";
import { ForgotPasswordPage } from "../pages/login/resetPage";
import DashboardPage from "../pages/admin/dashboardPage";
import AccountsPage from "../pages/admin/accountsPage";
import OrdersPage from "../pages/admin/ordersPage";
import CategoryPage from "../pages/admin/categoryPage";
import BrandsPage from "../pages/admin/brandsPage";
import VouchersPage from "../pages/admin/vouchersPage";
import SettingPage from "../pages/admin/settingPage";
import CartPage from "../pages/users/cartPage";
import PaymentPage from "../pages/users/paymentPage";
import OrderhistoryPage from "../pages/users/orderhistoryPage";
import CustomerOrderPage from "../pages/admin/customerorderPage";
import ProfilePage from "../pages/users/profilePage";
import WishlistPage from "../pages/users/wishlistPage";
import QRPaymentPage from "../pages/users/qrPaymentPage";
import EditProfilePage from "../pages/users/editProfilePage";
import { SkinCareRoutinePage } from "../pages/users/skinCareRoutine";
import { ProductRecommendationPage } from "../pages/users/productRecommendation";
import { ProtectedRoute } from "../components/ProtectedRoute";
import OrderHistoryPage from "../pages/users/orderhistoryPage";
import ProductDetailPage from "../pages/users/productDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "quiz-landing",
        element: <QuizLandingPage />,
      },
      {
        path: "quiz",
        element: <QuizPage />,
      },
      {
        path: "product",
        element: <ProductsPage />,
      },
      {
        path: "product/:productId",
        element: <ProductDetailPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "reset",
        element: <ForgotPasswordPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "payment",
        element: <PaymentPage />,
      },
      {
        path: "qr-payment",
        element: (
          <ProtectedRoute>
            <QRPaymentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        element: <OrderhistoryPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "account",
        element: <AccountsPage />,
      },
      {
        path: "order",
        element: <OrdersPage />,
      },
      {
        path: "orders",
        element: <OrderHistoryPage />,
      },
      {
        path: "category",
        element: <CategoryPage />,
      },
      {
        path: "brand",
        element: <BrandsPage />,
      },
      {
        path: "voucher",
        element: <VouchersPage />,
      },
      {
        path: "setting",
        element: <SettingPage />,
      },
      {
        path: "abouts",
        element: <AccountsPage />,
      },
      {
        path: "customerorder",
        element: <CustomerOrderPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "edit-profile",
        element: <EditProfilePage />,
      },
      {
        path: "wishlist",
        element: <WishlistPage />,
      },
      {
        path: "/skin-care-routine",
        element: <SkinCareRoutinePage />,
      },
      {
        path: "/product-recommendations",
        element: <ProductRecommendationPage />,
      },
    ],
  },
]);
