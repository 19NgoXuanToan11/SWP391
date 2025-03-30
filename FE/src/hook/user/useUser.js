import { useState, useEffect } from "react";
import UserService from "../../utils/user/userService";

export function useUser() {
  const [user, setUser] = useState(UserService.getCurrentUser());

  useEffect(() => {
    const unsubscribe = UserService.subscribe((newUser) => {
      setUser(newUser);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    fullName: user?.fullName || user?.name || user?.username || "User",
    isLoggedIn: !!user,
    login: UserService.login.bind(UserService),
    logout: UserService.logout.bind(UserService),
    updateUser: UserService.updateUserInfo.bind(UserService),
  };
}
