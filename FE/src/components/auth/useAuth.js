import { useSelector } from "react-redux";

export default function useAuth() {
  const auth = useSelector((state) => state.auth);
  return {
    isAuthenticated: !!auth?.user,
    user: auth?.user || null,
  };
};
