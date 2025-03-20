import React, { useState, useEffect } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const UserAvatar = ({ size = 32, className }) => {
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const getAvatarInfo = () => {
      const authUserStr = localStorage.getItem("auth_user");
      if (authUserStr) {
        try {
          const authUser = JSON.parse(authUserStr);
          const username = authUser.username || "";
          setUsername(username);

          // Tạo key riêng cho mỗi user
          const avatarKey = `userAvatar_${username}`;

          // Thử lấy avatar từ nhiều nguồn
          let avatarUrl =
            authUser.photoURL ||
            localStorage.getItem(avatarKey) ||
            sessionStorage.getItem(avatarKey);

          if (avatarUrl) {
            setAvatar(avatarUrl);
          } else {
            // Thử lấy từ IndexedDB nếu không có
            getAvatarFromIndexedDB(username).then((url) => {
              if (url) {
                setAvatar(url);
              }
            });
          }
        } catch (error) {
          console.error("Error parsing auth_user:", error);
        }
      }
    };

    getAvatarInfo();

    // Lắng nghe sự kiện thay đổi localStorage
    const handleStorageChange = () => {
      getAvatarInfo();
    };

    window.addEventListener("storage", handleStorageChange);

    // Lắng nghe sự kiện đăng nhập
    window.addEventListener("userLoggedIn", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleStorageChange);
    };
  }, []);

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
