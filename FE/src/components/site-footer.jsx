export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nội dung chính của Footer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Thông tin công ty */}
          <div className="lg:col-span-5">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-6">
              Beauty & Care
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-md">
              Chuyên gia chăm sóc sắc đẹp của bạn. Với đội ngũ chuyên nghiệp và
              sản phẩm cao cấp, chúng tôi cam kết mang đến cho bạn trải nghiệm
              làm đẹp tốt nhất.
            </p>
            {/* Liên kết mạng xã hội */}
            <div className="flex space-x-5">
              <a href="#" className="social-icon-link">
                <div className="w-10 h-10 bg-gray-800 hover:bg-pink-500/10 rounded-full flex items-center justify-center transition-all duration-300 group">
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </div>
              </a>
              <a href="#" className="social-icon-link">
                <div className="w-10 h-10 bg-gray-800 hover:bg-pink-500/10 rounded-full flex items-center justify-center transition-all duration-300 group">
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
              </a>
              <a href="#" className="social-icon-link">
                <div className="w-10 h-10 bg-gray-800 hover:bg-pink-500/10 rounded-full flex items-center justify-center transition-all duration-300 group">
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div className="lg:col-span-2">
            <div className="w-full flex flex-col space-y-6">
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
                    <a
                      href="#"
                      className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="w-full flex flex-col space-y-6">
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
                    <a
                      href="#"
                      className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Liên hệ */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-semibold text-white mb-6">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-400">
                <svg
                  className="w-5 h-5 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>contact@beauty.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <svg
                  className="w-5 h-5 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>(84) 123-456-789</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <svg
                  className="w-5 h-5 text-pink-500 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  123 Đường ABC,
                  <br />
                  Quận XYZ, HCMC
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Phần đăng ký nhận bản tin */}
        <div className="border-t border-gray-800 pt-8 pb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h5 className="text-xl font-semibold text-white mb-3">
              Đăng ký nhận bản tin của chúng tôi
            </h5>
            <p className="text-gray-400 mb-6">
              Nhận thông tin cập nhật mới nhất về các ưu đãi và dịch vụ của
              chúng tôi.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 flex-grow max-w-md"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-300">
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Thanh dưới cùng */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Beauty & Care. Bảo lưu mọi quyền.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 text-sm transition-colors duration-300"
              >
                Điều khoản
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 text-sm transition-colors duration-300"
              >
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
