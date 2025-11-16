import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CheckoutResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const resultCode = searchParams.get("errorCode"); // MoMo trả về errorCode
    const rid = searchParams.get("orderId"); // cậu dùng orderId = rid khi tạo request

    if (resultCode === "0") {
      alert("Thanh toán thành công!");
      navigate("/dashboard/yourUserId"); // đổi sang trang thành công
    } else {
      alert("Thanh toán thất bại. Quay lại giỏ hàng!");
      navigate(`/checkout?rid=${rid}`); // quay lại giữ vé
    }
  }, [navigate, searchParams]);

  return <div>Đang xử lý thanh toán...</div>;
}
