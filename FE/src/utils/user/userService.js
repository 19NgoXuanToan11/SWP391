// Tạo service quản lý thông tin người dùng toàn cục
const UserService = {
  // Biến lưu trữ thông tin người dùng hiện tại
  currentUser: null,

  // Các listeners đăng ký để nhận cập nhật
  listeners: [],

  // Phương thức đăng ký listener
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },

  // Thông báo cho tất cả listeners
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentUser));
  },

  // Thiết lập thông tin người dùng mới
  setCurrentUser(user) {
    this.currentUser = user;

    // Cập nhật localStorage
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    }

    // Thông báo cho tất cả listeners
    this.notifyListeners();

    // Kích hoạt sự kiện để các component không sử dụng service cũng có thể cập nhật
    window.dispatchEvent(new CustomEvent("userUpdated", { detail: { user } }));
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser() {
    // Nếu chưa có, thử lấy từ localStorage
    if (!this.currentUser) {
      const userStr = localStorage.getItem("auth_user");
      if (userStr) {
        try {
          this.currentUser = JSON.parse(userStr);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
    return this.currentUser;
  },

  // Phương thức đăng nhập
  login(userData) {
    // Đảm bảo fullName được thiết lập
    const user = {
      ...userData,
      fullName: userData.fullName || userData.name || userData.username,
    };

    this.setCurrentUser(user);
    return user;
  },

  // Phương thức đăng xuất
  logout() {
    this.currentUser = null;
    localStorage.removeItem("auth_user");
    this.notifyListeners();
    window.dispatchEvent(new Event("userLoggedOut"));
  },

  // Cập nhật thông tin người dùng
  updateUserInfo(updates) {
    if (!this.currentUser) return null;

    const updatedUser = {
      ...this.currentUser,
      ...updates,
    };

    this.setCurrentUser(updatedUser);
    return updatedUser;
  },

  // Lấy fullName của người dùng
  getFullName() {
    const user = this.getCurrentUser();
    return user
      ? user.fullName || user.name || user.username || "User"
      : "User";
  },
};

export default UserService;
