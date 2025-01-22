import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { HomePage } from "../pages/users/homePage";
import { LoginPage } from "../pages/login/loginPage";
import { RegisterPage } from "../pages/login/registerPage";
import { AboutPage } from "../pages/users/aboutPage";
import { ContactPage } from "../pages/users/contactPage";
import { ProductsPage } from "../pages/users/productPage";
import ProductDetailPage from "../pages/users/productdetailPage";
import { QuizPage } from "../pages/users/quizPage";
import { QuizLandingPage } from "../pages/users/quizlandingPage";
import { ForgotPasswordPage } from "../pages/login/resetPage";

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
        path: "detail",
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
    ],
  },
]);
