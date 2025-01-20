import React from "react";
import { useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const { productId } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">
          Chi tiết sản phẩm: {productId}
        </h1>
        <p>Thông tin chi tiết sản phẩm sẽ được hiển thị tại đây.</p>
      </div>
    </div>
  );
}
