// Tạo file mới để lưu các hàm tiện ích cho chăm sóc da

export const translateSkinConcern = (concern) => {
  const translations = {
    acne: "Mụn & Thâm mụn",
    wrinkles: "Nếp nhăn & Lão hóa",
    darkSpots: "Đốm nâu & Tăng sắc tố",
    dullness: "Da xỉn màu & Không đều",
    dryness: "Da khô & Thiếu ẩm",
    oiliness: "Da dầu",
    largePores: "Lỗ chân lông to",
    sensitivity: "Da nhạy cảm",
    redness: "Da đỏ & Kích ứng",
    unevenTexture: "Kết cấu da không đều",
  };
  return translations[concern] || concern;
};

export const getSkinTypeInfo = (skinType) => {
  const skinTypeInfo = {
    "Da khô": {
      description:
        "Da khô thường thiếu độ ẩm, dễ bong tróc và cảm thấy căng sau khi rửa mặt. Loại da này cần được cung cấp đủ độ ẩm và dưỡng chất.",
      tips: [
        "Sử dụng sữa rửa mặt dịu nhẹ, không chứa sulfate",
        "Thêm serum cấp ẩm chứa hyaluronic acid vào quy trình",
        "Sử dụng kem dưỡng ẩm đậm đặc vào ban đêm",
        "Tránh tẩy tế bào chết quá thường xuyên",
      ],
      color: "#f9a8d4",
      recommendedIngredients: [
        "Hyaluronic Acid",
        "Ceramides",
        "Glycerin",
        "Squalane",
        "Shea Butter",
      ],
    },
    "Da dầu": {
      description:
        "Da dầu thường tiết nhiều dầu, đặc biệt ở vùng chữ T. Loại da này cần kiểm soát lượng dầu thừa nhưng vẫn duy trì độ ẩm cần thiết.",
      tips: [
        "Sử dụng sữa rửa mặt có chứa salicylic acid",
        "Dùng toner không cồn để cân bằng độ pH",
        "Chọn kem dưỡng ẩm dạng gel hoặc lotion nhẹ",
        "Đắp mặt nạ đất sét 1-2 lần/tuần",
      ],
      color: "#93c5fd",
      recommendedIngredients: [
        "Salicylic Acid",
        "Niacinamide",
        "Tea Tree Oil",
        "Zinc",
        "Clay",
      ],
    },
    "Da hỗn hợp": {
      description:
        "Da hỗn hợp có vùng chữ T (trán, mũi, cằm) tiết dầu nhiều, trong khi má và các vùng khác có thể khô. Loại da này cần cân bằng giữa kiểm soát dầu và cung cấp độ ẩm.",
      tips: [
        "Sử dụng sản phẩm làm sạch nhẹ nhàng",
        "Áp dụng các sản phẩm khác nhau cho các vùng da khác nhau",
        "Dùng toner cân bằng không chứa cồn",
        "Sử dụng kem dưỡng ẩm nhẹ cho toàn mặt",
      ],
      color: "#a5b4fc",
      recommendedIngredients: [
        "Niacinamide",
        "Hyaluronic Acid",
        "Green Tea Extract",
        "Aloe Vera",
        "Vitamin E",
      ],
    },
    "Da nhạy cảm": {
      description:
        "Da nhạy cảm dễ bị kích ứng, đỏ và ngứa khi tiếp xúc với các sản phẩm mạnh hoặc thay đổi môi trường. Loại da này cần được chăm sóc nhẹ nhàng với các sản phẩm ít thành phần.",
      tips: [
        "Chọn sản phẩm không chứa hương liệu và cồn",
        "Thử nghiệm sản phẩm mới trên một vùng da nhỏ",
        "Tránh các thành phần gây kích ứng như retinol nồng độ cao",
        "Sử dụng sản phẩm có thành phần làm dịu như lô hội, yến mạch",
      ],
      color: "#fbcfe8",
      recommendedIngredients: [
        "Aloe Vera",
        "Oat Extract",
        "Centella Asiatica",
        "Chamomile",
        "Allantoin",
      ],
    },
  };

  return skinTypeInfo[skinType] || null;
};
