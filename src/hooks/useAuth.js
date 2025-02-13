import { useSelector } from "react-redux";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  return {
    isAuthenticated: !!auth?.user,
    user: auth?.user || null,
  };
};
