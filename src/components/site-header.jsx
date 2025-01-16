import {
  HomeOutlined,
  UserOutlined,
  ShoppingOutlined,
  ContactsOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import blackWhiteLogo from "../assets/pictures/black_white_on_trans.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-pink-100 bg-white/98 backdrop-blur-lg h-[120px] flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto px-10 w-full flex items-center">
        <div className="mr-14">
          <a
            href="/"
            className="flex items-center no-underline transform transition-transform duration-300 hover:scale-102"
          >
            <img
              src={blackWhiteLogo}
              alt="Beauty & Care Logo"
              className="h-[150px] w-auto my-4"
            />
          </a>
        </div>

        <nav className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <a
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-[0.95rem] font-medium text-gray-600 rounded-lg transition-all duration-300 hover:text-pink-500 hover:bg-pink-50"
            >
              <HomeOutlined className="text-lg" /> Home
            </a>

            <a
              href="/about"
              className="flex items-center gap-2 px-3 py-2 text-[0.95rem] font-medium text-gray-600 rounded-lg transition-all duration-300 hover:text-pink-500 hover:bg-pink-50"
            >
              <UserOutlined className="text-lg" /> About
            </a>

            <a
              href="/product"
              className="flex items-center gap-2 px-3 py-2 text-[0.95rem] font-medium text-gray-600 rounded-lg transition-all duration-300 hover:text-pink-500 hover:bg-pink-50"
            >
              <ShoppingOutlined className="text-lg" /> Product
            </a>

            <a
              href="/contact"
              className="flex items-center gap-2 px-3 py-2 text-[0.95rem] font-medium text-gray-600 rounded-lg transition-all duration-300 hover:text-pink-500 hover:bg-pink-50"
            >
              <ContactsOutlined className="text-lg" /> Contact
            </a>
          </div>

          <div className="flex items-center gap-6 ml-10">
            <button className="flex items-center gap-2 px-5 py-2.5 text-[0.95rem] font-medium text-pink-500 border-1.5 border-pink-500 rounded-lg transition-all duration-300 hover:bg-pink-50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
              <LoginOutlined /> Sign In
            </button>

            <button className="flex items-center gap-2 px-5 py-2.5 text-[0.95rem] font-medium text-white bg-pink-500 rounded-lg shadow-pink-500/20 shadow-md transition-all duration-300 hover:bg-pink-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
              Sign Up
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
