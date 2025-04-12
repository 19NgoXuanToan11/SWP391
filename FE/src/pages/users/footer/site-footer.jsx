import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

export function SiteFooter() {
  return (
    <footer className="relative bg-white text-gray-700 pt-24 pb-12 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl" />
        {/* Removed dark background overlay */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-sm bg-white p-6 rounded-2xl border border-gray-200 shadow-xl h-full"
          >
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent mb-6">
              Beauty & Care
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-base">
              Chuyên gia chăm sóc sắc đẹp của bạn. Với đội ngũ chuyên nghiệp và
              sản phẩm cao cấp, chúng tôi cam kết mang đến cho bạn trải nghiệm
              làm đẹp tốt nhất.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                {
                  icon: <FacebookOutlined />,
                  href: "https://www.facebook.com/xuantoan.ngo.18/",
                },
                {
                  icon: <InstagramOutlined />,
                  href: "https://www.instagram.com/xuantoannn_30/",
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gradient-to-br hover:from-pink-500/20 hover:to-purple-500/20 flex items-center justify-center 
                    transition-all duration-300 group border border-gray-200 hover:border-pink-500/50 backdrop-blur-sm shadow-lg"
                >
                  <span className="text-lg text-gray-600 group-hover:text-pink-600 transition-colors duration-300">
                    {social.icon}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="backdrop-blur-sm bg-white p-6 rounded-2xl border border-gray-200 shadow-xl h-full flex flex-col"
          >
            <h4 className="text-xl font-semibold text-gray-800 mb-6">
              Công ty
            </h4>
            <ul className="space-y-4 flex-grow">
              {[
                { name: "Blog", path: "/news" },
                { name: "Chính sách đổi trả", path: "/return-policy" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 flex items-center">
                      <ArrowRightOutlined className="opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Additional content to balance height */}
            <div className="mt-auto pt-4">
              <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4"></div>
              <p className="text-sm text-gray-500">
                Đồng hành cùng vẻ đẹp của bạn
              </p>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="backdrop-blur-sm bg-white p-6 rounded-2xl border border-gray-200 shadow-xl h-full"
          >
            <h4 className="text-xl font-semibold text-gray-800 mb-6">
              Liên hệ
            </h4>
            <ul className="space-y-4">
              {[
                {
                  icon: <MailOutlined className="text-pink-500" />,
                  text: "toannxse171297@fpt.edu.vn",
                },
                {
                  icon: <PhoneOutlined className="text-pink-500" />,
                  text: "0786485999",
                },
                {
                  icon: <EnvironmentOutlined className="text-pink-500" />,
                  text: "Thành phố Hồ Chí Minh",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-pink-500/20 group-hover:to-purple-500/20 transition-all duration-300 shadow-lg">
                    {item.icon}
                  </div>
                  <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="border-t border-gray-200 pt-8 mt-8 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">© 2025 Beauty & Care</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
