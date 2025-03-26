import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "../../store/slices/auth/authSlice";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Khôi phục trạng thái từ localStorage khi component mount
    dispatch(restoreAuth());
  }, [dispatch]);

  return children;
}
