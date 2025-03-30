import React, { useState, useEffect } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const UserAvatar = ({ size = 32, className, forceUpdate }) => {
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");

  // Hàm cập nhật avatar từ tất cả các nguồn có thể
  const updateAvatar = () => {
    const authUserStr = localStorage.getItem("auth_user");
    if (authUserStr) {
      try {
        const authUser = JSON.parse(authUserStr);
        const username = authUser.username || "";
        setUsername(username);

        // Tạo key riêng cho mỗi user
        const avatarKey = `userAvatar_${username}`;
        const globalAvatarKey = "userAvatar"; // Key chung

        // Ưu tiên lấy avatar từ các nguồn theo thứ tự
        let avatarUrl =
          authUser.photoURL ||
          localStorage.getItem(avatarKey) ||
          localStorage.getItem(globalAvatarKey) ||
          sessionStorage.getItem(avatarKey);

        if (avatarUrl) {
          setAvatar(avatarUrl);

          // Đồng bộ vào tất cả các storage để đảm bảo nhất quán
          localStorage.setItem(avatarKey, avatarUrl);
          localStorage.setItem(globalAvatarKey, avatarUrl);

          // Cập nhật lại auth_user để đảm bảo photoURL luôn mới nhất
          const updatedUser = { ...authUser, photoURL: avatarUrl };
          localStorage.setItem("auth_user", JSON.stringify(updatedUser));

          // Kích hoạt sự kiện để các component khác biết avatar đã thay đổi
          window.dispatchEvent(
            new CustomEvent("avatarUpdated", { detail: { avatarUrl } })
          );
        } else {
          // Thử lấy từ IndexedDB nếu không có
          getAvatarFromIndexedDB(username).then((url) => {
            if (url) {
              setAvatar(url);
              // Khôi phục vào các storage
              localStorage.setItem(avatarKey, url);
              localStorage.setItem(globalAvatarKey, url);

              // Cập nhật auth_user
              const updatedUser = { ...authUser, photoURL: url };
              localStorage.setItem("auth_user", JSON.stringify(updatedUser));

              // Kích hoạt sự kiện
              window.dispatchEvent(
                new CustomEvent("avatarUpdated", { detail: { avatarUrl: url } })
              );
            }
          });
        }
      } catch (error) {
        console.error("Error parsing auth_user:", error);
      }
    }
  };

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage ban đầu
    updateAvatar();

    // Lắng nghe sự kiện thay đổi localStorage
    const handleStorageChange = () => {
      updateAvatar();
    };

    // Lắng nghe sự kiện đăng nhập
    const handleUserLogin = () => {
      updateAvatar();
    };

    // Lắng nghe sự kiện avatar được cập nhật từ component khác
    const handleAvatarUpdated = () => {
      updateAvatar();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLogin);
    window.addEventListener("avatarUpdated", handleAvatarUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLogin);
      window.removeEventListener("avatarUpdated", handleAvatarUpdated);
    };
  }, [forceUpdate]);

  // Hàm lấy avatar từ IndexedDB
  const getAvatarFromIndexedDB = (username) => {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.log("Trình duyệt không hỗ trợ IndexedDB");
        resolve(null);
        return;
      }

      const request = window.indexedDB.open("UserAvatarDB", 1);

      request.onerror = () => {
        console.error("Lỗi khi mở IndexedDB");
        resolve(null);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("avatars")) {
          db.createObjectStore("avatars", { keyPath: "username" });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        try {
          const transaction = db.transaction(["avatars"], "readonly");
          const store = transaction.objectStore("avatars");
          const getRequest = store.get(username);

          getRequest.onsuccess = () => {
            if (getRequest.result) {
              resolve(getRequest.result.avatarUrl);

              // Cập nhật vào localStorage để lần sau dùng nhanh hơn
              const avatarKey = `userAvatar_${username}`;
              localStorage.setItem(avatarKey, getRequest.result.avatarUrl);
            } else {
              resolve(null);
            }
          };

          getRequest.onerror = () => {
            console.error("Lỗi khi lấy avatar từ IndexedDB");
            resolve(null);
          };
        } catch (error) {
          console.error("Lỗi khi truy cập IndexedDB:", error);
          resolve(null);
        }
      };
    });
  };

  return (
    <Avatar
      size={size}
      src={avatar}
      icon={!avatar && <UserOutlined />}
      className={className}
      alt={username}
    />
  );
};

export default UserAvatar;
