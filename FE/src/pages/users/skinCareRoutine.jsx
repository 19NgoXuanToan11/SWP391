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
  Divider,
  message,
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
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  translateSkinConcern,
  getSkinTypeInfo,
} from "../../utils/skinCareUtils";

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
  const navigate = useNavigate();
  const [autoFilled, setAutoFilled] = useState(false);

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
    return translations[englishConcern] || englishConcern;
  };

  useEffect(() => {
    // Kiểm tra xem form đã có giá trị người dùng nhập chưa
    const currentValues = form.getFieldsValue();
    const hasUserInput =
      currentValues.skinType && currentValues.skinType.length > 0;

    // Nếu đã tự động điền form hoặc người dùng đã nhập liệu, không tự động điền nữa
    if (autoFilled || hasUserInput) return;

    let shouldAutoFill = false;
    let formValues = {};

    // Chuyển đổi kết quả quiz sang tiếng Việt
    if (quizResults && quizResults.skinType) {
      shouldAutoFill = true;
      const vietnameseSkinType = translateSkinType(quizResults.skinType);
      const vietnameseConcerns =
        quizResults.concerns?.map((concern) => translateSkinConcern(concern)) ||
        [];

      formValues = {
        skinType: vietnameseSkinType,
        concerns: vietnameseConcerns,
      };
    } else {
      // Chuyển đổi routine đã lưu sang tiếng Việt từ localStorage
      const savedRoutine = localStorage.getItem("currentRoutine");
      if (savedRoutine) {
        try {
          const parsed = JSON.parse(savedRoutine);
          if (parsed && parsed.skinType) {
            shouldAutoFill = true;
            formValues = {
              skinType: parsed.skinType, // Không cần chuyển đổi vì đã là tiếng Việt
              concerns: parsed.concerns || [],
            };
          }
        } catch (error) {
          console.error("Error parsing saved routine:", error);
          localStorage.removeItem("currentRoutine");
        }
      }
    }

    // Chỉ điền form khi có dữ liệu hợp lệ
    if (shouldAutoFill) {
      form.setFieldsValue(formValues);
      setAutoFilled(true);

      // Không hiển thị message để tránh gây rối cho người dùng
    }
  }, [quizResults, form, autoFilled]);

  const handleSubmit = (values) => {
    console.log("Form values in handleSubmit:", values);

    // Kiểm tra lại giá trị một lần nữa để chắc chắn
    if (!values || !values.skinType) {
      message.error("Vui lòng chọn loại da của bạn trước khi tạo quy trình");
      return;
    }

    // Kiểm tra xem loại da có trong danh sách routines không
    if (!routines[values.skinType]) {
      message.error(`Không tìm thấy quy trình cho loại da ${values.skinType}`);
      return;
    }

    const selectedRoutine = routines[values.skinType];
    setRecommendations(selectedRoutine);

    // Lưu vào localStorage với giá trị tiếng Việt
    localStorage.setItem(
      "currentRoutine",
      JSON.stringify({
        skinType: values.skinType,
        concerns: values.concerns || [],
        routine: selectedRoutine,
      })
    );

    message.success(`Đã tạo quy trình cho ${values.skinType}`);
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl border border-white/50 overflow-hidden"
        >
          <div className="text-center p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-block p-3 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full">
                  <SkinOutlined className="text-2xl" />
                </div>
              </div>
              <Title level={2} className="!mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Quy Trình Chăm Sóc Da Cá Nhân Hóa
                </span>
              </Title>
              <Paragraph className="text-gray-600 max-w-xl mx-auto">
                Thiết kế một quy trình chăm sóc da hoàn hảo, tùy chỉnh riêng cho
                nhu cầu và loại da của bạn
              </Paragraph>
            </motion.div>
          </div>

          <div className="p-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="mb-8"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <Form.Item
                  name="skinType"
                  label={
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                        Loại Da Của Bạn
                      </span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn loại da của bạn",
                    },
                  ]}
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Select
                      placeholder="Chọn loại da của bạn"
                      className="relative bg-white rounded-2xl border-0 shadow-sm group-hover:shadow-md transition-all duration-300"
                      size="large"
                      dropdownClassName="rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm border border-white/70"
                      suffixIcon={
                        <div className="text-pink-400">
                          <SkinOutlined />
                        </div>
                      }
                    >
                      {skinTypes.map((type) => (
                        <Option key={type} value={type}>
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="py-2.5 px-2 flex items-center gap-3"
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
                            <span className="text-gray-700 font-medium">
                              {type}
                            </span>
                          </motion.div>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Form.Item>

                <Form.Item
                  name="concerns"
                  label={
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
                      <span className="text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                        Vấn Đề Về Da
                      </span>
                    </div>
                  }
                  help={
                    <span className="text-gray-500 italic text-xs mt-1.5 inline-block">
                      ✨ Chọn tất cả các vấn đề bạn đang gặp phải
                    </span>
                  }
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Select
                      mode="multiple"
                      placeholder="Chọn vấn đề về da của bạn"
                      className="relative bg-white rounded-2xl border-0 shadow-sm group-hover:shadow-md transition-all duration-300"
                      size="large"
                      maxTagCount={3}
                      maxTagTextLength={20}
                      showArrow
                      showSearch
                      suffixIcon={
                        <div className="text-pink-400">
                          <WarningOutlined />
                        </div>
                      }
                      tagRender={(props) => (
                        <Tag
                          {...props}
                          className="rounded-full px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 border-0 text-purple-800 shadow-sm"
                        >
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="text-xs md:text-sm flex items-center gap-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                            {props.label}
                          </motion.span>
                        </Tag>
                      )}
                      dropdownRender={(menu) => (
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-1 shadow-lg">
                          <div className="p-2 border-b border-gray-100 mb-1">
                            <span className="text-sm text-gray-500 italic">
                              Chọn các vấn đề bạn muốn cải thiện
                            </span>
                          </div>
                          {menu}
                        </div>
                      )}
                    >
                      {skinConcerns.map((concern) => (
                        <Option key={concern} value={concern}>
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="py-2.5 px-2 flex items-center gap-3 rounded-xl hover:bg-purple-50 transition-colors duration-300"
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
                            <span className="text-gray-700 font-medium">
                              {concern}
                            </span>
                          </motion.div>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 flex justify-center gap-4"
              >
                <button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 border-none h-auto py-3 px-8 rounded-full text-base text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <ExperimentOutlined />
                    Tạo Quy Trình Chăm Sóc Da
                  </span>
                </button>

                <button
                  type="default"
                  onClick={() => {
                    form.resetFields();
                    localStorage.removeItem("currentRoutine");
                    localStorage.removeItem("quizResults");
                    setRecommendations(null);
                    setAutoFilled(false);
                    message.success("Đã làm mới form");
                  }}
                  className="border-gray-300 text-gray-600 h-auto py-3 px-6 rounded-full text-base font-medium hover:border-pink-300 hover:text-pink-600 transition-all duration-300"
                >
                  Làm Mới
                </button>
              </motion.div>
            </Form>

            {recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8 mt-10"
              >
                <Divider>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text font-bold">
                      Quy Trình Cho {form.getFieldValue("skinType")}
                    </span>
                  </div>
                </Divider>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Morning Routine */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl overflow-hidden shadow-lg border border-orange-100/50"
                  >
                    <div className="p-6 bg-gradient-to-r from-amber-200/30 to-orange-200/30 border-b border-orange-100/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <SunOutlined className="text-lg" />
                        </div>
                        <Title level={4} className="!m-0 text-amber-800">
                          Quy Trình Buổi Sáng
                        </Title>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        {recommendations.morning.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-amber-100/50 hover:shadow-md transition-all duration-300 cursor-pointer"
                            onClick={() => handleProductClick(step)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white font-medium shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <Text strong className="text-amber-900">
                                    {step}
                                  </Text>
                                  <InfoCircleOutlined className="text-amber-500" />
                                </div>
                                <Text
                                  type="secondary"
                                  className="text-sm block mt-1"
                                >
                                  <ClockCircleOutlined className="mr-1" />
                                  {index < 2
                                    ? "Ngay sau khi thức dậy"
                                    : index < 4
                                    ? "Sau 2-3 phút"
                                    : "Trước khi ra ngoài"}
                                </Text>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Evening Routine */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden shadow-lg border border-indigo-100/50"
                  >
                    <div className="p-6 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 border-b border-indigo-100/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <MoonOutlined className="text-lg" />
                        </div>
                        <Title level={4} className="!m-0 text-indigo-800">
                          Quy Trình Buổi Tối
                        </Title>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        {recommendations.evening.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-indigo-100/50 hover:shadow-md transition-all duration-300 cursor-pointer"
                            onClick={() => handleProductClick(step)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-medium shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <Text strong className="text-indigo-900">
                                    {step}
                                  </Text>
                                  <InfoCircleOutlined className="text-indigo-500" />
                                </div>
                                <Text
                                  type="secondary"
                                  className="text-sm block mt-1"
                                >
                                  <ClockCircleOutlined className="mr-1" />
                                  {index < 2
                                    ? "Trước khi rửa mặt"
                                    : index < 4
                                    ? "Sau 2-3 phút"
                                    : "Trước khi đi ngủ"}
                                </Text>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
                >
                  <button
                    type="primary"
                    size="large"
                    icon={<ShoppingOutlined />}
                    onClick={() => navigate("/product-recommendations")}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 border-none h-auto py-3 px-8 rounded-full text-base text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transform hover:scale-105 transition-all duration-300"
                  >
                    Xem Sản Phẩm Phù Hợp
                  </button>

                  <button
                    type="default"
                    size="large"
                    icon={<BulbOutlined />}
                    onClick={() => setShowTips(true)}
                    className="border-pink-400 text-pink-600 h-auto py-3 px-8 rounded-full text-base font-medium hover:border-pink-500 hover:text-pink-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  >
                    Xem Lời Khuyên Chăm Sóc Da
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Skin Care Tips Modal */}
      <Modal
        title={
          <div className="text-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Lời Khuyên Chăm Sóc Da
            </span>
          </div>
        }
        open={showTips}
        onCancel={() => setShowTips(false)}
        footer={null}
        width={700}
        className="custom-modal"
      >
        <div className="space-y-6 p-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <Text strong className="text-lg text-purple-700 flex items-center">
              <SafetyOutlined className="mr-2" />
              Lời Khuyên Chung
            </Text>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {skinCareTips.general.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-purple-600"
                >
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <Text strong className="text-lg text-pink-700 flex items-center">
                <SunOutlined className="mr-2" />
                Quy Trình Buổi Sáng
              </Text>
              <Paragraph className="mt-2 text-pink-600">
                {skinCareTips.timing.morning}
              </Paragraph>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <Text
                strong
                className="text-lg text-indigo-700 flex items-center"
              >
                <MoonOutlined className="mr-2" />
                Quy Trình Buổi Tối
              </Text>
              <Paragraph className="mt-2 text-indigo-600">
                {skinCareTips.timing.evening}
              </Paragraph>
            </div>
          </div>
        </div>
      </Modal>

      {/* Product Detail Modal */}
      {renderProductModal()}
    </div>
  );
}
