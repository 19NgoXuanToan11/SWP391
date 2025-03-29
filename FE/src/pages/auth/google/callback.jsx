import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Xử lý hash fragment từ redirect URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (token) {
      // Gửi token đến cửa sổ cha (window opener)
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "google-auth-success",
            token: token,
          },
          window.location.origin
        );
      } else {
        // Nếu không có cửa sổ cha, điều hướng đến trang đăng nhập với token
        navigate("/login?token=" + token);
      }
    } else {
      // Xử lý khi không có token (đăng nhập thất bại)
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "google-auth-error",
            error: "No token received",
          },
          window.location.origin
        );
      } else {
        navigate("/login?error=google_auth_failed");
      }
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Đang xử lý đăng nhập...</h2>
        <p>Vui lòng đợi trong giây lát.</p>
      </div>
    </div>
  );
}
