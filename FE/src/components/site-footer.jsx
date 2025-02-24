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
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300 pt-24 pb-12 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent mb-6">
                Beauty & Care
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed max-w-md text-lg">
                Chuyên gia chăm sóc sắc đẹp của bạn. Với đội ngũ chuyên nghiệp
                và sản phẩm cao cấp, chúng tôi cam kết mang đến cho bạn trải
                nghiệm làm đẹp tốt nhất.
              </p>

              {/* Social Links */}
              <div className="flex space-x-5">
                {[
                  { icon: <FacebookOutlined />, href: "#" },
                  { icon: <InstagramOutlined />, href: "#" },
                  { icon: <LinkedinOutlined />, href: "#" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-gray-800 hover:bg-pink-500/20 flex items-center justify-center 
                      transition-all duration-300 group border border-gray-700 hover:border-pink-500/50"
                  >
                    <span className="text-xl text-gray-400 group-hover:text-pink-500 transition-colors duration-300">
                      {social.icon}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-white">Dịch vụ</h4>
              <ul className="space-y-4">
                {[
                  "Chăm sóc da",
                  "Massage",
                  "Spa",
                  "Trang điểm",
                  "Điều trị mụn",
                  "Trẻ hóa da",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      to="#"
                      className="text-gray-400 hover:text-pink-500 transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRightOutlined className="mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-white">Công ty</h4>
              <ul className="space-y-4">
                {[
                  "Về chúng tôi",
                  "Đội ngũ",
                  "Liên hệ",
                  "Cơ hội nghề nghiệp",
                  "Đối tác",
                  "Blog",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      to="#"
                      className="text-gray-400 hover:text-pink-500 transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRightOutlined className="mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold text-white mb-6">Liên hệ</h4>
              <ul className="space-y-4">
                {[
                  {
                    icon: <MailOutlined className="text-pink-500" />,
                    text: "contact@beauty.com",
                  },
                  {
                    icon: <PhoneOutlined className="text-pink-500" />,
                    text: "(84) 123-456-789",
                  },
                  {
                    icon: <EnvironmentOutlined className="text-pink-500" />,
                    text: "123 Đường ABC, Quận XYZ, HCMC",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <span className="text-gray-400">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="border-t border-gray-800 pt-8 pb-12"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h5 className="text-2xl font-semibold text-white mb-3">
              Đăng ký nhận bản tin
            </h5>
            <p className="text-gray-400 mb-6">
              Nhận thông tin cập nhật mới nhất về các ưu đãi và dịch vụ của
              chúng tôi.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="px-6 py-4 bg-gray-800 text-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 
                  flex-grow max-w-md border border-gray-700 hover:border-gray-600 transition-colors duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl 
                  hover:opacity-90 transition-opacity duration-300 font-medium"
              >
                Đăng ký
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="border-t border-gray-800 pt-8 mt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Beauty & Care. Bảo lưu mọi quyền.
            </p>
            <div className="flex space-x-6">
              <Link
                to="#"
                className="text-gray-400 hover:text-pink-500 text-sm transition-colors duration-300"
              >
                Điều khoản
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-pink-500 text-sm transition-colors duration-300"
              >
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
