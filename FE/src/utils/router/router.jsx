import { createBrowserRouter } from "react-router-dom";

import App from "../../App";

import HomePage from "../../pages/users/home/homePage";

// auth
import LoginPage from "../../pages/auth/login/loginPage";
import RegisterPage from "../../pages/auth/register/registerPage";
import ForgotPasswordPage from "../../pages/auth/forgot-password/forgotPasswordPage";
import ResetPasswordPage from "../../pages/auth/reset-password/resetPasswordPage";
import VerifyEmailPage from "../../pages/auth/verify-email/verifyEmailPage";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

// admin
import AdminProtectedRoute from "../../components/auth/AdminProtectedRoute";
import AdminLoginPage from "../../pages/admin/login/adminLoginPage";
import DashboardPage from "../../pages/admin/dashboard/dashboardPage";
import BrandsPage from "../../pages/admin/brand/brandsPage";
import CategoryPage from "../../pages/admin/category/categoryPage";
import OrdersPage from "../../pages/admin/order/ordersPage";
import AccountsPage from "../../pages/admin/account/accountsPage";
import ProductPage from "../../pages/admin/product/productPage";

// staff
import StaffLoginPage from "../../pages/staff/login/staffLoginPage";
import StaffOrdersPage from "../../pages/staff/order/staffOrdersPage";

// quiz
import QuizPage from "../../pages/users/quiz/quizPage";
import SkinCareRoutinePage from "../../pages/users/quiz/skincare-routine/skinCareRoutine";
import QuizResultsPage from "../../pages/users/quiz/quiz-result/quizResultsPage";
import QuizLandingPage from "../../pages/users/quiz/quiz-landing/quizlandingPage";
import ProductRecommendationPage from "../../pages/users/quiz/product-recommendation/productRecommendation";

// products
import ProductsPage from "../../pages/users/product/productPage";
import ProductDetailPage from "../../pages/users/product/product-detail/productDetailPage";

// cart
import CartPage from "../../pages/users/payment/cart/cartPage";

// checkout
import OrderSuccessPage from "../../pages/users/payment/order-success/orderSuccessPage";

import PaymentPage from "../../pages/users/payment/paymentPage";

// customer
// import CustomerOrderPage from "../../pages/admin/customer/customer-order/customerOrderPage";

// profile
import ProfilePage from "../../pages/users/profile/profilePage";
import EditProfilePage from "../../pages/users/profile/edit-profile/editProfilePage";

// news
import NewsPage from "../../components/home/news/newsPage";
import NewsDetailPage from "../../components/home/news/news-detail/newsDetailPage";

// wishlist
import WishlistPage from "../../pages/users/wishlist/wishlistPage";

// orders history
import OrdersHistoryPage from "../../pages/users/history/ordersHistoryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },

      // auth
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },

      // admin
      {
        path: "/admin/dashboard",
        element: (
          <AdminProtectedRoute>
            <DashboardPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/login",
        element: <AdminLoginPage />,
      },
      {
        path: "/admin/account",
        element: (
          <AdminProtectedRoute>
            <AccountsPage />,
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/order",
        element: (
          <AdminProtectedRoute>
            <OrdersPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/category",
        element: (
          <AdminProtectedRoute>
            <CategoryPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/products",
        element: (
          <AdminProtectedRoute>
            <ProductPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/brand",
        element: (
          <AdminProtectedRoute>
            <BrandsPage />
          </AdminProtectedRoute>
        ),
      },

      // staff
      {
        path: "staff/login",
        element: <StaffLoginPage />,
      },
      {
        path: "staff/orders",
        element: <StaffOrdersPage />,
      },

      // quiz
      {
        path: "quiz-landing",
        element: <QuizLandingPage />,
      },
      {
        path: "quiz",
        element: <QuizPage />,
      },
      {
        path: "quiz-results",
        element: <QuizResultsPage />,
      },
      {
        path: "skincare-routine",
        element: <SkinCareRoutinePage />,
      },
      {
        path: "product-recommendations",
        element: <ProductRecommendationPage />,
      },

      // products
      {
        path: "product",
        element: <ProductsPage />,
      },
      {
        path: "product/:productId",
        element: <ProductDetailPage />,
      },

      // cart
      {
        path: "cart",
        element: <CartPage />,
      },

      // checkout
      {
        path: "payment/:orderId",
        element: (
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-success",
        element: <OrderSuccessPage />,
      },

      // customer
      // {
      //   path: "customerorder",
      //   element: <CustomerOrderPage />,
      // },

      // profile
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "edit-profile",
        element: <EditProfilePage />,
      },

      // news
      {
        path: "news",
        element: <NewsPage />,
      },
      {
        path: "news/:id",
        element: <NewsDetailPage />,
      },

      // wishlist
      {
        path: "wishlist",
        element: <WishlistPage />,
      },

      // orders history
      {
        path: "orders",
        element: <OrdersHistoryPage />,
      },
    ],
  },
]);
