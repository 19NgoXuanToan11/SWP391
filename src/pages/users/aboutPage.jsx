import React from "react";

export function AboutPage() {
  return (
    <div className="about-container">
      <h1 className="about-title">Về Chúng Tôi</h1>

      <section className="about-content">
        <div className="about-section">
          <h2>Câu Chuyện Của Chúng Tôi</h2>
          <p>
            Chúng tôi là một đội ngũ đam mê về việc tạo ra những trải nghiệm
            tuyệt vời cho khách hàng. Được thành lập vào năm 20XX, chúng tôi
            luôn nỗ lực không ngừng để mang đến những sản phẩm và dịch vụ chất
            lượng cao.
          </p>
        </div>

        <div className="about-section">
          <h2>Sứ Mệnh</h2>
          <p>
            Sứ mệnh của chúng tôi là cung cấp những giải pháp sáng tạo và hiệu
            quả, đồng thời xây dựng mối quan hệ lâu dài với khách hàng dựa trên
            sự tin tưởng và tôn trọng.
          </p>
        </div>

        <div className="about-section">
          <h2>Giá Trị Cốt Lõi</h2>
          <ul className="core-values">
            <li>Chất lượng</li>
            <li>Sáng tạo</li>
            <li>Trung thực</li>
            <li>Tận tâm</li>
          </ul>
        </div>
      </section>

      <section className="contact-info">
        <h2>Liên Hệ</h2>
        <p>Email: contact@example.com</p>
        <p>Điện thoại: (123) 456-7890</p>
        <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
      </section>
    </div>
  );
}
