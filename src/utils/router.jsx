import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { HomePage } from "../pages/users/homePage";
import { LoginPage } from "../pages/login/loginPage";
import { RegisterPage } from "../pages/login/registerPage";
import { AboutPage } from "../pages/users/aboutPage";
import { ContactPage } from "../pages/users/contactPage";
import { ProductsPage } from "../pages/users/productPage";
import { QuizPage } from "../pages/users/quizPage";

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
        path: "quiz",
        element: <QuizPage />,
      },
      {
        path: "product",
        element: <ProductsPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);
