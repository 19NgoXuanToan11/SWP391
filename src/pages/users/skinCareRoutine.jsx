import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Button,
  Card,
  List,
  Typography,
  Steps,
  Tooltip,
  Modal,
  Tag,
} from "antd";
import {
  SkinOutlined,
  SunOutlined,
  MoonOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BulbOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export function SkinCareRoutinePage() {
  const location = useLocation();
  const quizResults =
    location.state?.quizResults ||
    JSON.parse(localStorage.getItem("quizResults"));
  const [form] = Form.useForm();
  const [recommendations, setRecommendations] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productDetails = {
    "Sữa rửa mặt dịu nhẹ": {
      purpose: "Loại bỏ bụi bẩn, dầu thừa và tạp chất mà không làm khô da",
      howToUse: "Mát xa nhẹ nhàng với nước ấm trong 60 giây",
      tips: "Sử dụng vào buổi sáng và buổi tối, tránh nước nóng",
      ingredients: ["Ceramides", "Glycerin", "Hyaluronic Acid"],
      benefits: [
        "Không gây kích ứng",
        "Duy trì hàng rào bảo vệ da",
        "Cân bằng pH",
      ],
      warnings: "Nếu có kích ứng, giảm tần suất sử dụng",
      price: "250.000đ - 400.000đ",
      recommendedBrands: ["Cerave", "La Roche-Posay", "Simple"],
    },
    "Nước cân bằng dưỡng ẩm": {
      purpose: "Cân bằng pH và cung cấp lớp hydrat hóa đầu tiên",
      howToUse: "Vỗ nhẹ bằng tay hoặc bông tẩy trang",
      tips: "Thoa khi da vẫn còn ẩm sau khi rửa mặt",
      ingredients: ["Hyaluronic Acid", "Panthenol", "Niacinamide"],
      benefits: [
        "Cung cấp độ ẩm",
        "Xoa dịu da",
        "Chuẩn bị cho các bước tiếp theo",
      ],
      warnings: "Tránh toner có cồn nếu bạn có làn da nhạy cảm",
      price: "200.000đ - 350.000đ",
      recommendedBrands: ["Hada Labo", "Klairs", "Paula's Choice"],
    },
    // ... Thêm chi tiết cho các sản phẩm khác
  };

  const skinTypes = [
    "Da thường",
    "Da khô",
    "Da dầu",
    "Da hỗn hợp",
    "Da nhạy cảm",
  ];

  const skinConcerns = [
    "Mụn & Thâm mụn",
    "Đốm nâu & Tăng sắc tố",
    "Nếp nhăn & Rãnh nhăn",
    "Da xỉn màu & Không đều",
    "Lỗ chân lông to",
    "Đỏ & Viêm",
    "Thiếu nước",
    "Mụn đầu đen & Mụn đầu trắng",
    "Quầng thâm mắt",
    "Da chảy xệ",
    "Tổn thương do nắng",
    "Màu da không đều",
  ];

  const routines = {
    "Da thường": {
      morning: [
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng dưỡng ẩm",
        "Serum Vitamin C",
        "Kem dưỡng ẩm nhẹ",
        "Kem chống nắng SPF 30+",
      ],
      evening: [
        "Tẩy trang dầu",
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng dưỡng ẩm",
        "Serum Niacinamide",
        "Kem dưỡng đêm",
      ],
    },
    "Da khô": {
      morning: [
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng dưỡng ẩm",
        "Serum Hyaluronic Acid",
        "Kem dưỡng ẩm đậm đặc",
        "Kem chống nắng SPF 30+",
      ],
      evening: [
        "Tẩy trang dầu",
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng dưỡng ẩm",
        "Serum phục hồi",
        "Kem dưỡng đêm giàu dưỡng chất",
      ],
    },
    "Da dầu": {
      morning: [
        "Sữa rửa mặt kiểm soát dầu",
        "Nước cân bằng không cồn",
        "Serum Niacinamide",
        "Kem dưỡng dạng gel",
        "Kem chống nắng không dầu",
      ],
      evening: [
        "Sữa rửa mặt kiểm soát dầu",
        "Sữa rửa mặt có BHA",
        "Nước cân bằng không cồn",
        "Serum trị mụn",
        "Kem dưỡng ẩm nhẹ",
      ],
    },
    "Da hỗn hợp": {
      morning: [
        "Sữa rửa mặt cân bằng",
        "Nước cân bằng không cồn",
        "Serum chống oxy hóa",
        "Kem dưỡng theo vùng",
        "Kem chống nắng nhẹ",
      ],
      evening: [
        "Tẩy trang dầu",
        "Sữa rửa mặt cân bằng",
        "Nước cân bằng không cồn",
        "Serum điều trị",
        "Kem dưỡng đêm theo vùng",
      ],
    },
    "Da nhạy cảm": {
      morning: [
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng làm dịu",
        "Serum Centella",
        "Kem dưỡng làm dịu",
        "Kem chống nắng khoáng chất",
      ],
      evening: [
        "Nước tẩy trang Micellar",
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng làm dịu",
        "Serum phục hồi",
        "Kem dưỡng phục hồi da",
      ],
    },
  };

  const skinCareTips = {
    general: [
      "Luôn thoa sản phẩm theo thứ tự từ loãng đến đặc",
      "Đợi 1-2 phút giữa các bước để sản phẩm thẩm thấu",
      "Sử dụng kem chống nắng hàng ngày, kể cả trời râm",
      "Không sử dụng nhiều sản phẩm mới cùng lúc",
      "Thử sản phẩm mới trên một vùng nhỏ trong 24-48 giờ",
    ],
    application: {
      cleansing: "Massage nhẹ nhàng theo chuyển động tròn. Không kéo căng da.",
      toning: "Vỗ nhẹ, không chà xát. Để từng lớp thẩm thấu.",
      moisturizing: "Thoa lên da còn hơi ẩm để tăng khả năng hấp thu.",
    },
    timing: {
      morning: "Tập trung vào bảo vệ: chống oxy hóa và chống nắng",
      evening: "Tập trung vào phục hồi: điều trị và dưỡng ẩm sâu",
    },
  };

  const handleProductClick = (productName) => {
    setSelectedProduct(productDetails[productName]);
  };

  const renderProductModal = () => (
    <Modal
      title={
        <div className="text-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Chi Tiết Sản Phẩm
          </span>
        </div>
      }
      open={selectedProduct !== null}
      onCancel={() => setSelectedProduct(null)}
      footer={null}
      width={700}
      className="custom-modal"
    >
      {selectedProduct && (
        <div className="space-y-6 p-4">
          {/* Mục đích sử dụng */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <Text strong className="text-lg text-purple-700 flex items-center">
              <ExperimentOutlined className="mr-2" />
              Mục Đích Sử Dụng
            </Text>
            <Paragraph className="mt-2 text-purple-600">
              {selectedProduct.purpose}
            </Paragraph>
          </div>

          {/* Cách sử dụng */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <Text strong className="text-lg text-blue-700 flex items-center">
              <InfoCircleOutlined className="mr-2" />
              Cách Sử Dụng
            </Text>
            <Paragraph className="mt-2 text-blue-600">
              {selectedProduct.howToUse}
            </Paragraph>
          </div>

          {/* Thành phần chính */}
          <div className="bg-pink-50 p-4 rounded-lg">
            <Text strong className="text-lg text-pink-700 flex items-center">
              <ExperimentOutlined className="mr-2" />
              Thành Phần Chính
            </Text>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProduct.ingredients.map((ingredient) => (
                <Tag color="pink" key={ingredient}>
                  {ingredient}
                </Tag>
              ))}
            </div>
          </div>

          {/* Lợi ích */}
          <div className="bg-green-50 p-4 rounded-lg">
            <Text strong className="text-lg text-green-700 flex items-center">
              <CheckCircleOutlined className="mr-2" />
              Lợi Ích
            </Text>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {selectedProduct.benefits.map((benefit) => (
                <li key={benefit} className="text-green-600">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Thương hiệu gợi ý */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <Text strong className="text-lg text-indigo-700 flex items-center">
              <ShoppingOutlined className="mr-2" />
              Thương Hiệu Gợi Ý
            </Text>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProduct.recommendedBrands?.map((brand) => (
                <Tag color="indigo" key={brand}>
                  {brand}
                </Tag>
              ))}
            </div>
            <Paragraph className="mt-2 text-indigo-600">
              Tầm giá tham khảo: {selectedProduct.price}
            </Paragraph>
          </div>

          {/* Lưu ý quan trọng */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <Text strong className="text-lg text-yellow-700 flex items-center">
              <WarningOutlined className="mr-2" />
              Lưu Ý Quan Trọng
            </Text>
            <Paragraph className="mt-2 text-yellow-600">
              {selectedProduct.warnings}
            </Paragraph>
          </div>

          {/* Tips */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <Text strong className="text-lg text-orange-700 flex items-center">
              <BulbOutlined className="mr-2" />
              Tips Sử Dụng
            </Text>
            <Paragraph className="mt-2 text-orange-600">
              {selectedProduct.tips}
            </Paragraph>
          </div>
        </div>
      )}
    </Modal>
  );

  const renderRoutineStep = (step, index, isLast, timing) => (
    <div className="relative pb-8">
      {!isLast && (
        <div className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-gradient-to-b from-purple-400 to-pink-400"></div>
      )}
      <div className="relative flex items-center space-x-4">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
          {index + 1}
        </div>
        <div
          className="flex-1 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => handleProductClick(step)}
        >
          <div className="flex justify-between items-center">
            <Text className="text-lg font-medium">{step}</Text>
            <Tooltip title="Click for detailed information">
              <InfoCircleOutlined className="text-purple-500" />
            </Tooltip>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <ClockCircleOutlined className="mr-1" />
            <Text type="secondary">
              {timing === "morning"
                ? "Sử dụng sau khi thức dậy"
                : "Sử dụng trước khi đi ngủ"}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );

  // Hàm chuyển đổi từ tiếng Anh sang tiếng Việt
  const translateSkinType = (englishType) => {
    const translations = {
      "Normal Skin": "Da thường",
      "Dry Skin": "Da khô",
      "Oily Skin": "Da dầu",
      "Combination Skin": "Da hỗn hợp",
      "Sensitive Skin": "Da nhạy cảm",
    };
    return translations[englishType] || englishType;
  };

  const translateSkinConcern = (englishConcern) => {
    const translations = {
      Acne: "Mụn & Thâm mụn",
      Aging: "Nếp nhăn & Lão hóa",
      Pigmentation: "Đốm nâu & Tăng sắc tố",
      Dullness: "Da xỉn màu & Không đều",
      // ... thêm các translations khác
    };
    return translations[englishConcern] || englishConcern;
  };

  useEffect(() => {
    // Chuyển đổi kết quả quiz sang tiếng Việt
    if (quizResults) {
      const vietnameseSkinType = translateSkinType(quizResults.skinType);
      const vietnameseConcerns = quizResults.concerns.map((concern) =>
        translateSkinConcern(concern)
      );

      form.setFieldsValue({
        skinType: vietnameseSkinType,
        concerns: vietnameseConcerns,
      });
    }

    // Chuyển đổi routine đã lưu sang tiếng Việt
    const savedRoutine = localStorage.getItem("currentRoutine");
    if (savedRoutine) {
      const parsed = JSON.parse(savedRoutine);
      form.setFieldsValue({
        skinType: translateSkinType(parsed.skinType),
        concerns: parsed.concerns.map((concern) =>
          translateSkinConcern(concern)
        ),
      });
    }
  }, [quizResults]);

  const handleSubmit = (values) => {
    const selectedRoutine = routines[values.skinType];
    if (selectedRoutine) {
      setRecommendations(selectedRoutine);

      // Lưu vào localStorage với giá trị tiếng Việt
      localStorage.setItem(
        "currentRoutine",
        JSON.stringify({
          skinType: values.skinType,
          concerns: values.concerns,
          routine: selectedRoutine,
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-xl rounded-2xl border-0">
          <div className="text-center mb-8">
            <Title level={2} className="!mb-2">
              <SkinOutlined className="mr-2 text-purple-500" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Quy Trình Chăm Sóc Da Cá Nhân Hóa
              </span>
            </Title>
            <Paragraph className="text-gray-500">
              Khám phá quy trình hoàn hảo phù hợp với làn da của bạn
            </Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="skinType"
                label={
                  <span className="text-lg font-medium text-red-300">
                    Loại Da Của Bạn
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng chọn loại da của bạn" },
                ]}
              >
                <Select
                  placeholder="Chọn loại da của bạn"
                  className="rounded-lg"
                  size="large"
                >
                  {skinTypes.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="concerns"
                label={
                  <span className="text-lg font-medium">Vấn Đề Về Da</span>
                }
                help="Chọn tất cả các vấn đề bạn đang gặp phải"
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn vấn đề về da của bạn"
                  className="rounded-lg"
                  size="large"
                  maxTagCount={3}
                  maxTagTextLength={20}
                  showArrow
                  showSearch
                >
                  {skinConcerns.map((concern) => (
                    <Option key={concern} value={concern}>
                      {concern}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full md:w-auto px-8 bg-gradient-to-r text-white from-purple-500 to-pink-500 border-0 rounded-full h-12 font-medium hover:shadow-lg transition-shadow duration-200"
            >
              Tạo Quy Trình
            </button>
          </Form>

          {recommendations && (
            <>
              <div className="mb-8 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <ExperimentOutlined className="text-blue-500 text-xl mt-1 mr-3" />
                  <div>
                    <Text strong className="text-blue-700">
                      Mẹo Quan Trọng Cho Quy Trình Của Bạn:
                    </Text>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      {skinCareTips.general.map((tip, index) => (
                        <li key={index} className="text-blue-600">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-12">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-6">
                    <SunOutlined className="text-2xl text-yellow-500 mr-3" />
                    <Title level={3} className="!mb-0">
                      Lịch trình buổi sáng
                    </Title>
                  </div>
                  <Paragraph className="mb-6 text-gray-600">
                    Tập trung vào bảo vệ và chuẩn bị da cho ngày hôm sau
                  </Paragraph>
                  <div className="space-y-4">
                    {recommendations.morning.map((step, index) =>
                      renderRoutineStep(
                        step,
                        index,
                        index === recommendations.morning.length - 1,
                        "morning"
                      )
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-6">
                    <MoonOutlined className="text-2xl text-blue-500 mr-3" />
                    <Title level={3} className="!mb-0">
                      Lịch trình buổi tối
                    </Title>
                  </div>
                  <Paragraph className="mb-6 text-gray-600">
                    Tập trung vào làm sạch và sửa chữa trong khi da tái tạo
                  </Paragraph>
                  <div className="space-y-4">
                    {recommendations.evening.map((step, index) =>
                      renderRoutineStep(
                        step,
                        index,
                        index === recommendations.evening.length - 1,
                        "evening"
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
      {renderProductModal()}
    </div>
  );
}
