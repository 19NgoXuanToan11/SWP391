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
  Badge,
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
  SkinFilled,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  translateSkinConcern,
  getSkinTypeInfo,
} from "@/utils/skincare/skinCareUtils";
import api from "../../../../config/axios/axios";
import endpoints from "../../../../constants/endpoint";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function SkinCareRoutinePage() {
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
  const [allProducts, setAllProducts] = useState([]);

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
      recommendedBrands: ["Cerave", "La Roche-Posay", "Simple"],
      icon: <SkinFilled />,
      color: "amber",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "60 giây",
      applyMethod: "Vỗ nhẹ bằng tay hoặc bông tẩy trang",
    },
    "Nước cân bằng dưỡng ẩm": {
      purpose:
        "Cân bằng pH da, bổ sung độ ẩm và chuẩn bị da cho các bước dưỡng tiếp theo",
      howToUse: "Thấm miếng bông hoặc vỗ nhẹ lên da sau khi rửa mặt",
      tips: "Sử dụng trên da còn hơi ẩm để thẩm thấu tốt hơn",
      ingredients: ["Ceramides", "Glycerin", "Rosewater", "Panthenol"],
      benefits: [
        "Bổ sung độ ẩm ngay lập tức",
        "Làm dịu và xoa dịu da khô",
        "Chuẩn bị da hấp thụ các dưỡng chất tiếp theo",
        "Làm mềm và mịn da",
      ],
      warnings: "Tránh các sản phẩm chứa cồn có thể làm khô da thêm",
      recommendedBrands: ["Laneige", "Hada Labo", "Thayers"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Sau khi rửa mặt",
      timeBefore: "30 giây",
      applyMethod: "Vỗ nhẹ lên da, tránh chà xát mạnh",
    },
    "Serum Hyaluronic Acid": {
      purpose:
        "Cung cấp và khóa ẩm sâu cho da khô, làm căng mọng và mềm mịn da",
      howToUse: "Thoa 3-4 giọt lên da còn hơi ẩm, vỗ nhẹ để thẩm thấu",
      tips: "Sử dụng trên da ẩm để tối đa hiệu quả giữ nước, có thể dùng cả sáng và tối",
      ingredients: ["Hyaluronic Acid", "Glycerin", "Panthenol", "Vitamin B5"],
      benefits: [
        "Bổ sung độ ẩm sâu cho các lớp da",
        "Làm căng mọng và giảm nhăn nông",
        "Làm dịu da khô và bong tróc",
        "Cải thiện kết cấu và độ đàn hồi",
      ],
      warnings:
        "Sử dụng trong môi trường quá khô có thể khiến serum hút ẩm từ da, nên dùng trong môi trường đủ ẩm",
      recommendedBrands: ["La Roche-Posay", "The Ordinary", "Vichy"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Sau bước toner",
      timeBefore: "30 giây",
      applyMethod: "Vỗ nhẹ để thẩm thấu và tránh chà xát",
    },
    "Serum phục hồi": {
      purpose:
        "Phục hồi và tái tạo hàng rào bảo vệ da, làm dịu kích ứng và tăng cường độ ẩm",
      howToUse:
        "Thoa 3-5 giọt lên toàn mặt, tập trung vào vùng khô và tổn thương",
      tips: "Sử dụng vào buổi tối để da phục hồi qua đêm, tránh dùng chung với acid mạnh",
      ingredients: [
        "Ceramides",
        "Peptides",
        "Centella Asiatica",
        "Madecassoside",
      ],
      benefits: [
        "Phục hồi hàng rào bảo vệ da bị tổn thương",
        "Làm dịu da kích ứng và đỏ",
        "Tăng cường độ ẩm và giữ nước",
        "Giảm tình trạng bong tróc và khô ráp",
      ],
      warnings:
        "Một số thành phần có thể gây kích ứng với da nhạy cảm, nên test trước khi sử dụng",
      recommendedBrands: ["Dr. Jart+", "La Roche-Posay", "Bioderma"],
      icon: <ExperimentOutlined />,
      color: "green",
      timeOfDay: "Buổi tối, sau bước toner",
      timeBefore: "30 giây",
      applyMethod: "Vỗ nhẹ và mát xa đến khi thẩm thấu",
    },
    "Kem dưỡng ẩm đậm đặc": {
      purpose: "Cung cấp độ ẩm sâu và tạo lớp màng bảo vệ cho da khô",
      howToUse: "Thoa một lượng vừa đủ lên toàn mặt và cổ, massage nhẹ nhàng",
      tips: "Sử dụng trên da còn hơi ẩm sau serum để khóa ẩm tốt nhất",
      ingredients: ["Shea Butter", "Squalane", "Ceramides", "Fatty Acids"],
      benefits: [
        "Cung cấp độ ẩm sâu và lâu dài",
        "Tạo lớp màng bảo vệ chống mất nước",
        "Làm mềm và mịn những vùng da khô ráp",
        "Dưỡng da mềm mại qua đêm",
      ],
      warnings:
        "Có thể hơi nặng cho vùng chữ T, tập trung vào vùng má và cằm nếu da hỗn hợp",
      recommendedBrands: ["CeraVe", "La Roche-Posay", "First Aid Beauty"],
      icon: <ExperimentOutlined />,
      color: "amber",
      timeOfDay: "Sau các bước serum",
      timeBefore: "60 giây",
      applyMethod: "Massage nhẹ nhàng theo hướng lên trên và ra ngoài",
    },
    "Kem dưỡng đêm giàu dưỡng chất": {
      purpose: "Nuôi dưỡng và phục hồi da qua đêm với nhiều dưỡng chất đậm đặc",
      howToUse: "Thoa một lớp dày vừa phải lên toàn mặt và cổ trước khi đi ngủ",
      tips: "Kết hợp với mát-xa mặt 1-2 phút để tăng cường hấp thu",
      ingredients: ["Retinol", "Peptides", "Niacinamide", "Natural Oils"],
      benefits: [
        "Nuôi dưỡng sâu và phục hồi da qua đêm",
        "Cải thiện kết cấu và độ đàn hồi",
        "Giảm dấu hiệu lão hóa và nếp nhăn",
        "Làm sáng và đều màu da",
      ],
      warnings:
        "Các thành phần như retinol có thể gây kích ứng ban đầu, nên dùng cách ngày khi mới bắt đầu",
      recommendedBrands: ["Estée Lauder", "La Mer", "Sulwhasoo"],
      icon: <ExperimentOutlined />,
      color: "purple",
      timeOfDay: "Buổi tối, trước khi đi ngủ",
      timeBefore: "90 giây",
      applyMethod: "Mát-xa nhẹ nhàng theo hướng lên trên để tăng cường hấp thu",
    },
    "Kem chống nắng SPF 30+": {
      purpose: "Bảo vệ da khỏi tác hại của tia UVA/UVB với độ dưỡng ẩm cao",
      howToUse: "Thoa đều lớp dày vừa đủ (1/4 thìa cà phê) lên mặt và cổ",
      tips: "Thoa lại sau mỗi 2 giờ tiếp xúc với ánh nắng và sau khi bơi/đổ mồ hôi",
      ingredients: [
        "Zinc Oxide",
        "Titanium Dioxide",
        "Hyaluronic Acid",
        "Glycerin",
      ],
      benefits: [
        "Bảo vệ da khỏi tác hại của tia UV",
        "Cung cấp độ ẩm suốt ngày",
        "Ngăn ngừa khô ráp và bong tróc do nắng",
        "Giảm nguy cơ lão hóa sớm do ánh nắng",
      ],
      warnings:
        "Một số sản phẩm có thể để lại vệt trắng, nên chọn loại phù hợp với tông da",
      recommendedBrands: ["La Roche-Posay", "Bioderma", "Eucerin"],
      icon: <ExperimentOutlined />,
      color: "yellow",
      timeOfDay: "Bước cuối cùng trong quy trình buổi sáng",
      timeBefore: "15-20 phút trước khi ra ngoài",
      applyMethod: "Thoa đều và vỗ nhẹ, nhớ thoa đủ lượng để bảo vệ tối ưu",
    },
    "Tẩy trang dầu": {
      purpose:
        "Hòa tan và loại bỏ lớp trang điểm, kem chống nắng và dầu nhờn mà không làm khô da",
      howToUse:
        "Mát xa dầu lên da khô trong 1-2 phút, sau đó rửa sạch với nước ấm",
      tips: "Massage nhẹ nhàng để hòa tan makeup và kem chống nắng, đặc biệt chú ý vùng mắt",
      ingredients: [
        "Olive Oil",
        "Jojoba Oil",
        "Vitamin E",
        "Sunflower Seed Oil",
      ],
      benefits: [
        "Làm sạch sâu mà không gây khô da",
        "Hòa tan hoàn toàn makeup không trôi và kem chống nắng",
        "Bổ sung dưỡng chất trong quá trình làm sạch",
        "Duy trì cân bằng độ ẩm tự nhiên của da",
      ],
      warnings:
        "Nhớ rửa sạch dầu sau khi tẩy trang để tránh gây bít tắc lỗ chân lông",
      recommendedBrands: ["DHC", "Kose Softymo", "The Face Shop"],
      icon: <SkinFilled />,
      color: "orange",
      timeOfDay: "Bước đầu tiên trong quy trình buổi tối",
      timeBefore: "60-120 giây",
      applyMethod: "Mát xa theo chuyển động tròn để hòa tan makeup và bụi bẩn",
    },
    "Sữa rửa mặt kiểm soát dầu": {
      purpose: "Loại bỏ dầu thừa, bụi bẩn và tạp chất trên da dầu",
      howToUse: "Tạo bọt với nước ấm, mát xa nhẹ nhàng và rửa sạch",
      tips: "Sử dụng không quá 2 lần/ngày để tránh kích thích sản sinh dầu",
      ingredients: ["Salicylic Acid", "Tea Tree Oil", "Zinc PCA"],
      benefits: [
        "Kiểm soát dầu nhờn hiệu quả",
        "Làm sạch sâu lỗ chân lông",
        "Ngăn ngừa mụn",
        "Không làm khô da quá mức",
      ],
      warnings: "Có thể hơi khô da, nên kết hợp với kem dưỡng ẩm phù hợp",
      recommendedBrands: ["La Roche-Posay", "Neutrogena", "COSRX"],
      icon: <SkinFilled />,
      color: "blue",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "60 giây",
      applyMethod: "Massage nhẹ nhàng, chú ý vùng chữ T",
    },
    "Sữa rửa mặt có BHA": {
      purpose: "Làm sạch sâu, loại bỏ tế bào chết và thông thoáng lỗ chân lông",
      howToUse: "Mát xa lên mặt ẩm trong 30-60 giây, tránh vùng mắt",
      tips: "Sử dụng 2-3 lần/tuần nếu da nhạy cảm, có thể hàng ngày với da dầu",
      ingredients: ["Salicylic Acid (BHA)", "Allantoin", "Panthenol"],
      benefits: [
        "Loại bỏ tế bào chết nhẹ nhàng",
        "Làm sạch sâu lỗ chân lông",
        "Ngăn ngừa và điều trị mụn",
        "Cải thiện kết cấu da",
      ],
      warnings: "Có thể gây khô, bắt đầu với tần suất thấp và tăng dần",
      recommendedBrands: ["Paula's Choice", "COSRX", "CeraVe"],
      icon: <SkinFilled />,
      color: "green",
      timeOfDay: "Trước khi rửa mặt",
      timeBefore: "60 giây",
      applyMethod: "Mát xa nhẹ nhàng tập trung vào vùng chữ T và chỗ có mụn",
    },
    "Sữa rửa mặt cân bằng": {
      purpose: "Làm sạch da hỗn hợp mà không làm mất cân bằng độ ẩm",
      howToUse: "Massage lên mặt ẩm trong 30-60 giây, rửa sạch với nước ấm",
      tips: "Sử dụng hai lần mỗi ngày, tập trung vào vùng chữ T",
      ingredients: ["Amino Acids", "Glycerin", "Hyaluronic Acid"],
      benefits: [
        "Làm sạch mà không làm khô da",
        "Cân bằng vùng da dầu và khô",
        "Duy trì pH tự nhiên của da",
        "Hỗ trợ hàng rào bảo vệ da",
      ],
      warnings: "Tránh rửa mặt bằng nước quá nóng hoặc quá lạnh",
      recommendedBrands: ["Cetaphil", "CeraVe", "Klairs"],
      icon: <SkinFilled />,
      color: "blue",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "60 giây",
      applyMethod: "Massage nhẹ nhàng, tập trung vào vùng chữ T",
    },
    "Nước cân bằng không cồn": {
      purpose: "Cân bằng pH da và chuẩn bị da cho các bước dưỡng tiếp theo",
      howToUse: "Thấm miếng bông hoặc vỗ nhẹ lên da sau khi rửa mặt",
      tips: "Sử dụng trên da còn hơi ẩm để thẩm thấu tốt hơn",
      ingredients: ["Hyaluronic Acid", "Niacinamide", "Amino Acids"],
      benefits: [
        "Cân bằng độ pH",
        "Không gây khô da",
        "Làm sạch dư lượng sữa rửa mặt",
        "Chuẩn bị da hấp thu các sản phẩm tiếp theo",
      ],
      warnings: "Tránh sử dụng toner chứa cồn có thể gây khô và kích ứng da",
      recommendedBrands: ["Thayers", "Klairs", "Pyunkang Yul"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "30 giây",
      applyMethod: "Vỗ nhẹ lên da, không chà xát",
    },
    "Nước cân bằng làm dịu": {
      purpose:
        "Làm dịu da kích ứng, cân bằng pH và chuẩn bị da cho các bước tiếp theo",
      howToUse: "Thấm miếng bông hoặc vỗ nhẹ lên da sau khi rửa mặt",
      tips: "Có thể để tủ lạnh để tăng tác dụng làm dịu",
      ingredients: ["Centella Asiatica", "Panthenol", "Allantoin"],
      benefits: [
        "Làm dịu da kích ứng",
        "Giảm đỏ và ngứa",
        "Tăng cường hàng rào bảo vệ da",
        "Cân bằng pH",
      ],
      warnings:
        "Kiểm tra phản ứng trước khi sử dụng toàn mặt nếu da rất nhạy cảm",
      recommendedBrands: ["Etude House", "Klairs", "I'm From"],
      icon: <ExperimentOutlined />,
      color: "green",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "30 giây",
      applyMethod: "Vỗ nhẹ nhàng, tránh chà xát mạnh",
    },
    "Serum chống oxy hóa": {
      purpose: "Bảo vệ da khỏi tác hại của gốc tự do và ngăn ngừa lão hóa sớm",
      howToUse: "Thoa 3-4 giọt lên da sau bước toner vào buổi sáng",
      tips: "Sử dụng vào buổi sáng để bảo vệ tối ưu khỏi tác nhân môi trường",
      ingredients: ["Vitamin C", "Vitamin E", "Ferulic Acid", "Resveratrol"],
      benefits: [
        "Trung hòa gốc tự do",
        "Ngăn ngừa lão hóa sớm",
        "Cải thiện tông màu da",
        "Tăng cường hiệu quả chống nắng",
      ],
      warnings:
        "Một số thành phần có thể không ổn định dưới ánh sáng, bảo quản đúng cách",
      recommendedBrands: ["SkinCeuticals", "Paula's Choice", "The Ordinary"],
      icon: <ExperimentOutlined />,
      color: "orange",
      timeOfDay: "Sau 2-3 phút",
      timeBefore: "30 giây",
      applyMethod: "Thoa đều và vỗ nhẹ để thẩm thấu",
    },
    "Serum điều trị": {
      purpose: "Điều trị các vấn đề cụ thể về da như mụn, nếp nhăn, hoặc thâm",
      howToUse: "Thoa lên vùng da cần điều trị hoặc toàn mặt tùy vấn đề",
      tips: "Sử dụng buổi tối để tăng hiệu quả phục hồi qua đêm",
      ingredients: ["Retinol", "Azelaic Acid", "Peptides", "AHA/BHA"],
      benefits: [
        "Điều trị vấn đề da cụ thể",
        "Tăng tốc tái tạo tế bào",
        "Cải thiện kết cấu và màu sắc da",
        "Kích thích sản sinh collagen",
      ],
      warnings: "Có thể gây kích ứng ban đầu, nên bắt đầu với tần suất thấp",
      recommendedBrands: ["Paula's Choice", "The Ordinary", "La Roche-Posay"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Sau 2-3 phút",
      timeBefore: "30 giây",
      applyMethod: "Thoa đều theo chuyển động hướng lên trên và ra ngoài",
    },
    "Kem chống nắng nhẹ": {
      purpose:
        "Bảo vệ da khỏi tác hại của tia UVA/UVB với kết cấu nhẹ, không nhờn",
      howToUse: "Thoa lượng đủ (1/4 thìa cà phê) lên mặt và cổ",
      tips: "Bôi lại sau mỗi 2 giờ tiếp xúc với ánh nắng",
      ingredients: [
        "Chemical Filters",
        "Zinc Oxide",
        "Titanium Dioxide",
        "Niacinamide",
      ],
      benefits: [
        "Bảo vệ da khỏi tia UVA/UVB",
        "Kết cấu nhẹ, dễ thấm",
        "Không gây bít tắc lỗ chân lông",
        "Phù hợp cho da hỗn hợp",
      ],
      warnings: "Vẫn cần bôi lại thường xuyên dù là kết cấu nhẹ",
      recommendedBrands: ["La Roche-Posay", "ISNTREE", "Skin Aqua"],
      icon: <ExperimentOutlined />,
      color: "yellow",
      timeOfDay: "Trước khi ra ngoài",
      timeBefore: "15-20 phút trước khi tiếp xúc với nắng",
      applyMethod: "Thoa đều và vỗ nhẹ để không tạo vệt",
    },
    "Serum Niacinamide": {
      purpose: "Kiểm soát dầu, thu nhỏ lỗ chân lông và làm đều màu da",
      howToUse: "Thoa 3-4 giọt lên toàn mặt, tập trung vào vùng chữ T",
      tips: "Sử dụng cả sáng và tối, có thể kết hợp với hầu hết các thành phần khác",
      ingredients: ["Niacinamide 10%", "Zinc PCA", "Hyaluronic Acid"],
      benefits: [
        "Kiểm soát dầu và bóng nhờn",
        "Thu nhỏ lỗ chân lông",
        "Cải thiện đốm thâm và không đều màu",
        "Tăng cường hàng rào bảo vệ da",
      ],
      warnings: "Có thể gây đỏ nhẹ khi mới dùng, bắt đầu với nồng độ thấp",
      recommendedBrands: ["The Ordinary", "Paula's Choice", "Some By Mi"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Sau bước toner",
      timeBefore: "30 giây",
      applyMethod: "Thoa đều và vỗ nhẹ để thẩm thấu",
    },
    "Serum trị mụn": {
      purpose: "Điều trị mụn hiện có và ngăn ngừa mụn mới hình thành",
      howToUse: "Chấm trực tiếp lên vùng mụn hoặc thoa đều lên vùng da dễ mụn",
      tips: "Sử dụng buổi tối để đạt hiệu quả tối ưu qua đêm",
      ingredients: ["Salicylic Acid", "Benzoyl Peroxide", "Tea Tree Extract"],
      benefits: [
        "Giảm viêm và đỏ mụn nhanh chóng",
        "Giảm sự tiết dầu",
        "Ngăn ngừa mụn mới",
        "Làm giảm vết thâm sau mụn",
      ],
      warnings: "Có thể gây khô da, nên dưỡng ẩm sau khi sử dụng",
      recommendedBrands: ["La Roche-Posay", "COSRX", "Paula's Choice"],
      icon: <ExperimentOutlined />,
      color: "green",
      timeOfDay: "Sau bước toner",
      timeBefore: "30 giây",
      applyMethod: "Thoa đều hoặc chấm cục bộ tùy mức độ mụn",
    },
    "Serum Vitamin C": {
      purpose: "Làm sáng da, chống oxy hóa và ngăn ngừa lão hóa sớm",
      howToUse: "Thoa 2-3 giọt lên toàn mặt vào buổi sáng",
      tips: "Bảo quản trong tủ lạnh để tăng tuổi thọ và hiệu quả làm dịu",
      ingredients: ["Vitamin C (L-Ascorbic Acid)", "Vitamin E", "Ferulic Acid"],
      benefits: [
        "Làm sáng và đều màu da",
        "Bảo vệ da khỏi tác hại của ánh nắng và ô nhiễm",
        "Kích thích sản sinh collagen",
        "Giảm thâm nám và tàn nhang",
      ],
      warnings:
        "Có thể gây châm chích nhẹ khi mới sử dụng, không dùng chung với Retinol",
      recommendedBrands: ["Bioderma", "SkinCeuticals", "The Ordinary"],
      icon: <ExperimentOutlined />,
      color: "orange",
      timeOfDay: "Buổi sáng, sau bước toner",
      timeBefore: "30 giây",
      applyMethod: "Thoa đều và vỗ nhẹ để thẩm thấu",
    },
    "Kem dưỡng dạng gel": {
      purpose:
        "Cung cấp độ ẩm nhẹ cho da dầu mà không gây bít tắc lỗ chân lông",
      howToUse: "Thoa một lượng vừa đủ lên toàn mặt sau các bước dưỡng",
      tips: "Bảo quản trong tủ lạnh để tăng hiệu quả làm dịu và mát da",
      ingredients: ["Hyaluronic Acid", "Aloe Vera", "Glycerin"],
      benefits: [
        "Cung cấp độ ẩm không gây nhờn",
        "Làm dịu và mát da",
        "Không gây bít tắc lỗ chân lông",
        "Thẩm thấu nhanh không gây bết dính",
      ],
      warnings:
        "Không đủ dưỡng ẩm cho các vùng da khô, cần dùng thêm kem dưỡng nếu da hỗn hợp",
      recommendedBrands: ["Bioderma", "Some By Mi", "Neutrogena"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Sau các bước serum",
      timeBefore: "60 giây",
      applyMethod: "Thoa đều và vỗ nhẹ để thẩm thấu nhanh hơn",
    },
    "Kem dưỡng ẩm nhẹ": {
      purpose: "Cung cấp độ ẩm cần thiết cho da dầu mà không gây bí tắc",
      howToUse: "Thoa một lượng vừa đủ lên toàn mặt và cổ, massage nhẹ nhàng",
      tips: "Chọn kem dưỡng có chứa thành phần oil-free, non-comedogenic",
      ingredients: ["Hyaluronic Acid", "Ceramides", "Niacinamide"],
      benefits: [
        "Cân bằng độ ẩm mà không gây nhờn",
        "Tăng cường hàng rào bảo vệ da",
        "Giúp da mềm mại, mịn màng",
        "Không gây bít tắc lỗ chân lông",
      ],
      warnings:
        "Chọn sai loại có thể làm tăng tiết dầu, nên thử trên một vùng nhỏ trước",
      recommendedBrands: ["Neutrogena", "CeraVe", "La Roche-Posay"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Sau các bước serum",
      timeBefore: "60 giây",
      applyMethod: "Thoa đều lên mặt và cổ theo hướng từ trong ra ngoài",
    },
    "Kem chống nắng không dầu": {
      purpose: "Bảo vệ da khỏi tác hại của tia UVA/UVB với kết cấu không dầu",
      howToUse: "Thoa đều một lượng vừa đủ (1/4 thìa cà phê) lên mặt và cổ",
      tips: "Thoa lại sau mỗi 2 giờ tiếp xúc với ánh nắng hoặc sau khi bơi, đổ mồ hôi nhiều",
      ingredients: ["Zinc Oxide", "Titanium Dioxide", "Silica"],
      benefits: [
        "Bảo vệ da khỏi tác hại của tia UV",
        "Không gây bít tắc lỗ chân lông",
        "Kiểm soát dầu nhờn suốt ngày",
        "Thẩm thấu nhanh không để lại vệt trắng",
      ],
      warnings:
        "Không bỏ qua bước này dù trời râm, vẫn cần thoa lại thường xuyên",
      recommendedBrands: ["La Roche-Posay", "Bioderma", "Anessa"],
      icon: <ExperimentOutlined />,
      color: "yellow",
      timeOfDay: "Bước cuối cùng trong quy trình buổi sáng",
      timeBefore: "15-20 phút trước khi ra ngoài",
      applyMethod: "Thoa đều và vỗ nhẹ, đảm bảo không bỏ sót vùng nào",
    },
    "Kem chống nắng kiểm soát dầu": {
      purpose:
        "Bảo vệ da khỏi tác hại của tia UV và kiểm soát dầu nhờn suốt ngày",
      howToUse: "Thoa đều một lượng vừa đủ lên mặt và cổ, chú ý vùng chữ T",
      tips: "Bôi lại sau mỗi 2 giờ khi ra ngoài hoặc sau khi lau mặt, đổ mồ hôi",
      ingredients: ["Zinc Oxide", "Titanium Dioxide", "Niacinamide", "Silica"],
      benefits: [
        "Bảo vệ da khỏi tác hại của tia UVA/UVB",
        "Kiểm soát dầu nhờn và bóng nhờn hiệu quả",
        "Làm mờ lỗ chân lông",
        "Kết cấu mỏng nhẹ, không gây bí da",
      ],
      warnings:
        "Vẫn cần bôi lại thường xuyên, kể cả khi ở trong nhà gần cửa sổ",
      recommendedBrands: ["La Roche-Posay", "ISNTREE", "Skin Aqua"],
      icon: <ExperimentOutlined />,
      color: "yellow",
      timeOfDay: "Sau các bước dưỡng khác",
      timeBefore: "15-20 phút trước khi ra ngoài",
      applyMethod: "Thoa đều, chú ý vùng dễ đổ dầu",
    },
    "Kem dưỡng theo vùng": {
      purpose:
        "Dưỡng ẩm theo từng vùng da, cân bằng vùng da dầu và cung cấp độ ẩm cho vùng da khô",
      howToUse:
        "Thoa kem dưỡng ẩm nhẹ cho vùng chữ T, kem đậm đặc hơn cho vùng má và cằm",
      tips: "Có thể sử dụng hai loại kem dưỡng khác nhau cho các vùng da khác nhau",
      ingredients: ["Hyaluronic Acid", "Niacinamide", "Ceramides", "Vitamin E"],
      benefits: [
        "Cân bằng độ ẩm cho da hỗn hợp",
        "Kiểm soát dầu ở vùng T mà không làm khô các vùng khác",
        "Cải thiện kết cấu da không đồng đều",
        "Phù hợp với nhu cầu cụ thể của từng vùng da",
      ],
      warnings:
        "Để ý phản ứng của da khi dùng nhiều sản phẩm khác nhau cùng lúc",
      recommendedBrands: ["The Ordinary", "La Roche-Posay", "CeraVe"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Sau các bước serum",
      timeBefore: "60 giây",
      applyMethod:
        "Thoa riêng biệt theo từng vùng da, tập trung vào các vùng khô",
    },
    "Kem dưỡng đêm theo vùng": {
      purpose:
        "Nuôi dưỡng và phục hồi qua đêm, tập trung vào nhu cầu cụ thể của từng vùng da",
      howToUse:
        "Thoa kem phục hồi dành cho vùng má và cằm, kem điều tiết dầu cho vùng chữ T",
      tips: "Vùng da nào cảm thấy căng hoặc khô thì bổ sung thêm dưỡng ẩm",
      ingredients: [
        "Retinol",
        "Peptides",
        "Niacinamide",
        "Ceramides",
        "Natural Oils",
      ],
      benefits: [
        "Phục hồi da theo nhu cầu cụ thể qua đêm",
        "Cân bằng độ ẩm cho da hỗn hợp",
        "Giảm bóng nhờn vùng T và ngăn khô vùng má",
        "Cải thiện tổng thể kết cấu da không đồng đều",
      ],
      warnings:
        "Thành phần như retinol có thể mẫn cảm với ánh nắng, nhớ bôi kem chống nắng vào sáng hôm sau",
      recommendedBrands: ["Estée Lauder", "La Roche-Posay", "Bioderma"],
      icon: <ExperimentOutlined />,
      color: "purple",
      timeOfDay: "Buổi tối, trước khi đi ngủ",
      timeBefore: "90 giây",
      applyMethod:
        "Thoa riêng biệt cho từng vùng da, nhẹ nhàng vỗ nhẹ để thẩm thấu",
    },
    "Serum Centella": {
      purpose: "Làm dịu, giảm viêm và tăng cường hàng rào bảo vệ da nhạy cảm",
      howToUse: "Thoa 3-4 giọt lên toàn mặt, tập trung vào vùng đỏ và kích ứng",
      tips: "Sử dụng cả sáng và tối, có thể đặt trong tủ lạnh để tăng hiệu quả làm mát",
      ingredients: [
        "Centella Asiatica",
        "Madecassoside",
        "Panthenol",
        "Allantoin",
      ],
      benefits: [
        "Làm dịu da đỏ và kích ứng",
        "Giảm viêm và giảm ngứa",
        "Tăng cường phục hồi da",
        "Củng cố hàng rào bảo vệ da",
      ],
      warnings:
        "Kiểm tra kỹ thành phần, một số sản phẩm có thể chứa cồn hoặc hương liệu",
      recommendedBrands: ["Dr. Jart+", "Purito", "Skin1004"],
      icon: <ExperimentOutlined />,
      color: "green",
      timeOfDay: "Sau bước toner, buổi sáng và tối",
      timeBefore: "30 giây",
      applyMethod: "Thoa nhẹ nhàng, vỗ nhẹ để thẩm thấu",
    },
    "Kem dưỡng làm dịu": {
      purpose: "Cung cấp độ ẩm và làm dịu da nhạy cảm, giảm đỏ và kích ứng",
      howToUse:
        "Thoa một lượng vừa đủ lên toàn mặt, tập trung vào vùng khô và kích ứng",
      tips: "Có thể sử dụng làm mặt nạ dưỡng ẩm bằng cách thoa lớp dày hơn",
      ingredients: [
        "Aloe Vera",
        "Oat Extract",
        "Centella Asiatica",
        "Ceramides",
      ],
      benefits: [
        "Làm dịu da đỏ và kích ứng ngay lập tức",
        "Cung cấp độ ẩm mà không gây bí tắc",
        "Giảm cảm giác châm chích và ngứa",
        "Tăng cường hàng rào bảo vệ da",
      ],
      warnings: "Nếu da quá nhạy cảm, bắt đầu với lượng nhỏ và tăng dần",
      recommendedBrands: ["La Roche-Posay", "Avene", "Bioderma"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Sau các bước serum",
      timeBefore: "60 giây",
      applyMethod: "Thoa nhẹ nhàng theo chuyển động tròn",
    },
    "Kem chống nắng khoáng chất": {
      purpose:
        "Bảo vệ da nhạy cảm khỏi tác hại của tia UVA/UVB bằng chất chống nắng vật lý",
      howToUse: "Thoa đều lớp dày vừa đủ (1/4 thìa cà phê) lên mặt và cổ",
      tips: "Thoa lại sau mỗi 2 giờ tiếp xúc với ánh nắng, sản phẩm có thể để lại vệt trắng",
      ingredients: [
        "Zinc Oxide",
        "Titanium Dioxide",
        "Centella Asiatica",
        "Vitamin E",
      ],
      benefits: [
        "Bảo vệ da khỏi tia UVA/UVB mà không gây kích ứng",
        "Có tác dụng làm dịu và chống viêm",
        "An toàn cho da nhạy cảm, không gây bít tắc lỗ chân lông",
        "Hiệu quả ngay sau khi thoa (không cần chờ như kem chống nắng hóa học)",
      ],
      warnings: "Có thể để lại vệt trắng, cần thoa kỹ và đều để tránh vệt",
      recommendedBrands: ["La Roche-Posay", "Bioderma", "Avene"],
      icon: <ExperimentOutlined />,
      color: "yellow",
      timeOfDay: "Bước cuối cùng trong quy trình buổi sáng",
      timeBefore: "15-20 phút trước khi ra ngoài",
      applyMethod: "Thoa đều và vỗ nhẹ, đặc biệt chú ý vùng dễ cháy nắng",
    },
    "Nước tẩy trang Micellar": {
      purpose:
        "Làm sạch nhẹ nhàng, loại bỏ bụi bẩn và trang điểm mà không làm khô hoặc kích ứng da",
      howToUse:
        "Thấm miếng bông và lau nhẹ nhàng trên da, không cần rửa lại với nước (tùy loại)",
      tips: "Lý tưởng cho da nhạy cảm vì không cần chà xát mạnh, có thể sử dụng để làm sạch nhanh",
      ingredients: ["Micelles", "Glycerin", "Nước tinh khiết", "Panthenol"],
      benefits: [
        "Làm sạch mà không làm khô da",
        "Loại bỏ trang điểm và kem chống nắng nhẹ nhàng",
        "Không gây kích ứng hoặc cảm giác căng da",
        "Không cần rửa lại, tiện lợi khi đi du lịch hoặc thiếu nước",
      ],
      warnings:
        "Một số loại vẫn cần rửa lại bằng nước, đọc kỹ hướng dẫn sản phẩm",
      recommendedBrands: ["Bioderma", "Garnier", "La Roche-Posay"],
      icon: <SkinFilled />,
      color: "blue",
      timeOfDay: "Bước đầu tiên trong quy trình buổi tối",
      timeBefore: "30-60 giây",
      applyMethod: "Lau nhẹ nhàng, không chà xát mạnh",
    },
    "Kem dưỡng phục hồi da": {
      purpose:
        "Tăng cường hàng rào bảo vệ da, phục hồi da bị tổn thương và cung cấp độ ẩm sâu",
      howToUse: "Thoa một lượng vừa đủ lên toàn mặt và cổ trước khi đi ngủ",
      tips: "Sử dụng khi da bị kích ứng, đỏ hoặc sau khi tiếp xúc với khói bụi, thời tiết khắc nghiệt",
      ingredients: [
        "Ceramides",
        "Shea Butter",
        "Panthenol",
        "Allantoin",
        "Centella Asiatica",
      ],
      benefits: [
        "Phục hồi da bị tổn thương qua đêm",
        "Giảm đỏ và kích ứng hiệu quả",
        "Tăng cường độ ẩm và làm mềm da",
        "Củng cố hàng rào bảo vệ da tự nhiên",
      ],
      warnings:
        "Có thể hơi dày và nặng, sử dụng lượng vừa phải để tránh bít tắc lỗ chân lông",
      recommendedBrands: ["La Roche-Posay", "Avene", "Bioderma"],
      icon: <ExperimentOutlined />,
      color: "purple",
      timeOfDay: "Buổi tối, trước khi đi ngủ",
      timeBefore: "90 giây",
      applyMethod:
        "Massage nhẹ nhàng theo chuyển động tròn, tập trung vào vùng bị tổn thương",
    },
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
        "Kem dưỡng đêm giàu dưỡng chất",
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
        "Serum Niacinamide",
        "Kem chống nắng nhẹ",
      ],
      evening: [
        "Tẩy trang dầu",
        "Sữa rửa mặt cân bằng",
        "Nước cân bằng không cồn",
        "Serum điều trị",
        "Kem chống nắng kiểm soát dầu",
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
    const productInfo = productDetails[productName];
    let recommendedProducts = getProductsForStep(productName, 3);

    // Ensure we have at least some products
    if (recommendedProducts.length === 0) {
      // Fallback to a default mockProduct if nothing else is available
      recommendedProducts = [
        {
          productId: "default-01",
          productName: `${productName} Premium`,
          brandName: "Bioderma",
          price: 380000,
          stock: 42,
          rating: 4.7,
          imageUrls:
            "https://cf.shopee.vn/file/sg-11134201-22110-i5a9e1cudjjv59",
          skinTypeName: "Da dầu",
          productTypeName: productName,
        },
        {
          productId: "default-02",
          productName: `${productName} Advanced Formula`,
          brandName: "La Roche-Posay",
          price: 420000,
          stock: 35,
          rating: 4.6,
          imageUrls:
            "https://cf.shopee.vn/file/sg-11134201-22110-yrh5z64dkhivb2",
          skinTypeName: "Da dầu",
          productTypeName: productName,
        },
      ];
    }

    setSelectedProduct({
      ...productInfo,
      name: productName,
      recommendedProducts: recommendedProducts,
    });
  };

  const getProductsForStep = (step, limit = 2) => {
    // Nếu chưa có sản phẩm từ API, trả về mảng rỗng
    if (!allProducts || allProducts.length === 0) {
      return [];
    }

    // Kiểm tra loại sản phẩm dựa trên tên bước
    let productType = "";

    // Phân loại đơn giản cho các bước chính
    if (step.includes("Sữa rửa mặt")) {
      productType = "cleanser";
    } else if (step.includes("Nước cân bằng") || step.includes("Toner")) {
      productType = "toner";
    } else if (step.includes("Serum")) {
      productType = "serum";
    } else if (step.includes("Kem dưỡng")) {
      productType = "moisturizer";
    } else if (step.includes("Kem chống nắng")) {
      productType = "sunscreen";
    } else if (step.includes("Tẩy trang") || step.includes("Micellar")) {
      productType = "cleanser";
    } else {
      // Nếu không xác định được, sử dụng mặc định là "skincare"
      productType = "skincare";
    }

    // Lấy tất cả sản phẩm, ưu tiên sản phẩm cho da nhạy cảm
    let allSuitableProducts = [...allProducts];

    // Sắp xếp sản phẩm dựa trên độ phù hợp
    allSuitableProducts.sort((a, b) => {
      // Ưu tiên 1: Phù hợp với loại da nhạy cảm
      const aIsSensitive =
        a.skinTypeName === "Da nhạy cảm" || a.skinTypeName === "Mọi loại da";
      const bIsSensitive =
        b.skinTypeName === "Da nhạy cảm" || b.skinTypeName === "Mọi loại da";

      if (aIsSensitive && !bIsSensitive) return -1;
      if (!aIsSensitive && bIsSensitive) return 1;

      // Ưu tiên 2: Tên sản phẩm có chứa tên bước
      const aNameIncludes =
        a.productName &&
        a.productName.toLowerCase().includes(step.toLowerCase());
      const bNameIncludes =
        b.productName &&
        b.productName.toLowerCase().includes(step.toLowerCase());

      if (aNameIncludes && !bNameIncludes) return -1;
      if (!aNameIncludes && bNameIncludes) return 1;

      // Ưu tiên 3: Loại sản phẩm phù hợp
      const aTypeMatches =
        a.productTypeName &&
        (a.productTypeName.toLowerCase().includes(productType) ||
          step.toLowerCase().includes(a.productTypeName.toLowerCase()));

      const bTypeMatches =
        b.productTypeName &&
        (b.productTypeName.toLowerCase().includes(productType) ||
          step.toLowerCase().includes(b.productTypeName.toLowerCase()));

      if (aTypeMatches && !bTypeMatches) return -1;
      if (!aTypeMatches && bTypeMatches) return 1;

      // Nếu không có ưu tiên nào phân biệt, sắp xếp theo giá
      return (a.price || 0) - (b.price || 0);
    });

    // Nếu không có sản phẩm phù hợp sau khi lọc, đơn giản là lấy bất kỳ sản phẩm nào
    if (allSuitableProducts.length === 0) {
      console.log(
        `Không tìm thấy sản phẩm phù hợp cho bước ${step}, hiển thị tất cả sản phẩm`
      );
      allSuitableProducts = allProducts;
    }

    // Lấy ít nhất 2 sản phẩm đầu tiên
    return allSuitableProducts.slice(0, Math.max(limit, 2));
  };

  const renderEnhancedRoutineStep = (step, index, isLast, timing) => {
    const details = productDetails[step] || {
      purpose: "Chăm sóc da chuyên sâu",
      howToUse: "Theo hướng dẫn của sản phẩm",
      tips: "Tham khảo hướng dẫn cụ thể trên bao bì",
      ingredients: ["Thành phần chuyên biệt"],
      price: "Tùy theo thương hiệu",
    };

    // Thêm màu sắc theo từng bước
    const getColorScheme = () => {
      if (timing === "morning") {
        return {
          borderColor: "border-l-4 border-amber-400",
          textColor: "text-amber-800",
          iconColor: "text-amber-500",
          iconBg: "from-amber-400 to-amber-500",
          timeBgColor: "bg-amber-100",
          timeTextColor: "text-amber-700",
        };
      } else {
        return {
          borderColor: "border-l-4 border-indigo-400",
          textColor: "text-indigo-800",
          iconColor: "text-indigo-500",
          iconBg: "from-indigo-400 to-indigo-500",
          timeBgColor: "bg-indigo-100",
          timeTextColor: "text-indigo-700",
        };
      }
    };

    const colorScheme = getColorScheme();

    const getTimeOfUse = () => {
      if (details.timeOfDay) {
        return details.timeOfDay;
      } else {
        return timing === "morning" ? "Buổi sáng" : "Buổi tối";
      }
    };

    // Get products for this step using the enhanced function
    const stepProducts = getProductsForStep(step);

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 * index }}
        className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm ${colorScheme.borderColor} hover:shadow-md transition-all duration-300`}
      >
        <div className="flex items-start space-x-3">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorScheme.iconBg} flex items-center justify-center text-white font-medium shrink-0`}
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <Text strong className={`text-lg ${colorScheme.textColor}`}>
                {step}
              </Text>
              <Tooltip title="Xem chi tiết sản phẩm">
                <InfoCircleOutlined
                  className={`${colorScheme.iconColor} cursor-pointer`}
                  onClick={() => handleProductClick(step)}
                />
              </Tooltip>
            </div>

            <div className="mt-2">
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full ${colorScheme.timeBgColor} ${colorScheme.timeTextColor} text-xs mb-2`}
              >
                <ClockCircleOutlined className="mr-1" />
                <Text className={`${colorScheme.timeTextColor} text-xs`}>
                  {getTimeOfUse()}
                </Text>
              </div>

              <Paragraph
                className={`text-sm mt-1 ${colorScheme.textColor} opacity-80 line-clamp-2`}
              >
                {details.purpose}
              </Paragraph>

              {/* Display specific product recommendations directly in the step */}
              <div className="mt-3 space-y-2">
                <Text
                  className={`${colorScheme.textColor} font-medium text-sm`}
                >
                  Sản phẩm gợi ý:
                </Text>
                <div className="space-y-2">
                  {stepProducts && stepProducts.length > 0 ? (
                    stepProducts.map((product, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-white/90 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
                        onClick={() =>
                          navigate(`/product/${product.productId}`)
                        }
                      >
                        <img
                          src={
                            product.imageUrls ||
                            "https://via.placeholder.com/100x100.png?text=Sản+phẩm"
                          }
                          alt={product.productName}
                          className="w-14 h-14 object-cover rounded-md border border-gray-200"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/100x100.png?text=Sản+phẩm";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <Text className="font-medium text-xs text-gray-500 line-clamp-1">
                            {product.brandName || "Thương hiệu"}
                          </Text>
                          <Text className="font-medium text-sm line-clamp-1">
                            {product.productName}
                          </Text>
                          <div className="flex items-center justify-between mt-1">
                            <Text className="text-pink-600 font-bold">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                                maximumFractionDigits: 0,
                              }).format(product.price)}
                            </Text>
                            {product.stock <= 0 ? (
                              <Badge
                                count="Hết hàng"
                                style={{ backgroundColor: "#f5222d" }}
                              />
                            ) : product.stock <= 5 ? (
                              <Badge
                                count={`Còn ${product.stock}`}
                                style={{ backgroundColor: "#fa8c16" }}
                              />
                            ) : (
                              <Badge
                                count="Còn hàng"
                                style={{ backgroundColor: "#52c41a" }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Text className="text-gray-500 text-sm">
                        Không tìm thấy sản phẩm phù hợp
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderProductModal = () => (
    <Modal
      open={selectedProduct !== null}
      footer={null}
      onCancel={() => setSelectedProduct(null)}
      width={800}
      className="custom-modal"
      centered
    >
      {selectedProduct && (
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedProduct.name}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Mục đích sử dụng */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <Text strong className="text-lg text-blue-700 flex items-center">
                <SafetyOutlined className="mr-2" />
                Mục Đích Sử Dụng
              </Text>
              <Paragraph className="mt-2 text-blue-600">
                {selectedProduct.purpose}
              </Paragraph>
            </div>

            {/* Cách sử dụng */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <Text
                strong
                className="text-lg text-purple-700 flex items-center"
              >
                <InfoCircleOutlined className="mr-2" />
                Cách Sử Dụng
              </Text>
              <Paragraph className="mt-2 text-purple-600">
                {selectedProduct.howToUse}
              </Paragraph>
            </div>
          </div>

          {/* Sản phẩm được đề xuất */}
          <div className="mb-6">
            <Text
              strong
              className="text-lg text-pink-700 flex items-center mb-3"
            >
              <ShoppingOutlined className="mr-2" />
              Sản Phẩm Được Đề Xuất
            </Text>

            {selectedProduct.recommendedProducts &&
            selectedProduct.recommendedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProduct.recommendedProducts.map((product, idx) => (
                  <Card
                    key={idx}
                    hoverable
                    className="overflow-hidden rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    cover={
                      <div className="h-44 overflow-hidden">
                        <img
                          alt={product.productName}
                          src={
                            product.imageUrls ||
                            "https://via.placeholder.com/300x300.png?text=Sản+phẩm"
                          }
                          className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x300.png?text=Sản+phẩm";
                          }}
                        />
                      </div>
                    }
                    onClick={() => navigate(`/product/${product.productId}`)}
                  >
                    <div className="px-1">
                      <div>
                        <Text className="text-xs text-gray-500 font-medium">
                          {product.brandName || "Thương hiệu"}
                        </Text>
                        <div className="h-12">
                          <Text className="font-medium text-sm line-clamp-2">
                            {product.productName}
                          </Text>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <Text className="text-pink-600 font-bold">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              maximumFractionDigits: 0,
                            }).format(product.price)}
                          </Text>
                          {product.stock <= 0 ? (
                            <Badge
                              count="Hết hàng"
                              style={{ backgroundColor: "#f5222d" }}
                            />
                          ) : product.stock <= 5 ? (
                            <Badge
                              count={`Còn ${product.stock}`}
                              style={{ backgroundColor: "#fa8c16" }}
                            />
                          ) : (
                            <Badge
                              count="Còn hàng"
                              style={{ backgroundColor: "#52c41a" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <Text className="text-gray-500">
                  Chưa có sản phẩm được đề xuất cho bước này.
                </Text>
              </div>
            )}
          </div>

          {/* Thành phần chính với hiệu ứng khung */}
          <div className="mb-6">
            <Text
              strong
              className="text-lg text-indigo-700 flex items-center mb-3"
            >
              <ExperimentOutlined className="mr-2" />
              Thành Phần Nổi Bật
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedProduct.ingredients?.map((ingredient, index) => (
                <Tooltip
                  key={index}
                  title={getIngredientDescription(ingredient)}
                  color="blue"
                >
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-sm cursor-help">
                    <Text className="text-indigo-700 block text-center">
                      {ingredient}
                    </Text>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Lợi ích với checklist */}
          <div className="mb-6 bg-green-50 p-4 rounded-lg">
            <Text strong className="text-lg text-green-700 flex items-center">
              <CheckCircleOutlined className="mr-2" />
              Lợi Ích Chính
            </Text>
            <div className="mt-2">
              {selectedProduct.benefits?.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start mt-2 text-green-600"
                >
                  <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                  <Text>{benefit}</Text>
                </div>
              ))}
            </div>
          </div>

          {/* Lưu ý quan trọng với thiết kế nổi bật */}
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <Text strong className="text-lg text-yellow-700 flex items-center">
              <WarningOutlined className="mr-2" />
              Lưu Ý Quan Trọng
            </Text>
            <Paragraph className="mt-2 text-yellow-600">
              {selectedProduct.warnings}
            </Paragraph>
          </div>

          {/* Tips với các điểm hữu ích */}
          <div className="bg-orange-50 p-4 rounded-lg mt-6">
            <Text strong className="text-lg text-orange-700 flex items-center">
              <BulbOutlined className="mr-2" />
              Tips Sử Dụng
            </Text>
            <div className="mt-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <BulbOutlined className="text-orange-500" />
              </div>
              <Paragraph className="text-orange-600 m-0 mt-2">
                {selectedProduct.tips}
              </Paragraph>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );

  // Hàm trả về mô tả cho từng thành phần
  const getIngredientDescription = (ingredient) => {
    const descriptions = {
      Ceramides:
        "Giúp khôi phục hàng rào bảo vệ da, giữ ẩm và bảo vệ da khỏi tác nhân gây hại",
      Glycerin:
        "Chất giữ ẩm tự nhiên, thu hút nước từ không khí và giữ nước trong da",
      "Hyaluronic Acid":
        "Giữ ẩm mạnh mẽ, có thể giữ lượng nước gấp 1000 lần trọng lượng của nó",
      Niacinamide:
        "Vitamin B3, giúp làm sáng da, giảm dầu, thu nhỏ lỗ chân lông và cải thiện đốm nâu",
      Panthenol: "Vitamin B5, làm dịu, giữ ẩm và hỗ trợ quá trình làm lành da",
      "Salicylic Acid":
        "BHA giúp loại bỏ tế bào chết, thông thoáng lỗ chân lông và điều trị mụn",
      "Tea Tree Oil":
        "Tinh dầu tự nhiên có đặc tính kháng khuẩn, giúp giảm mụn và kiểm soát dầu",
      "Zinc PCA": "Kiểm soát dầu và giảm viêm, hỗ trợ điều trị mụn",
      "Vitamin C":
        "Chống oxy hóa mạnh, làm sáng da, kích thích sản sinh collagen và ngăn ngừa lão hóa",
      "Vitamin E":
        "Chống oxy hóa, bảo vệ da khỏi tác hại môi trường và giúp dưỡng ẩm",
      "Ferulic Acid": "Chống oxy hóa, tăng cường hiệu quả của Vitamin C và E",
      Retinol:
        "Dẫn xuất vitamin A, kích thích tái tạo tế bào và sản sinh collagen, chống lão hóa",
      Peptides:
        "Chuỗi amino acid giúp tái tạo và sửa chữa da, kích thích sản sinh collagen",
      "Centella Asiatica":
        "Chiết xuất thực vật có tác dụng làm dịu, phục hồi và chống viêm",
      Allantoin: "Làm dịu, phục hồi và kích thích tái tạo tế bào da",
      "Shea Butter": "Dưỡng ẩm sâu, làm mềm và phục hồi da khô, chống oxy hóa",
      Squalane:
        "Dầu tự nhiên giống với dầu tự nhiên của da, dưỡng ẩm mà không gây bít tắc lỗ chân lông",
      "Aloe Vera":
        "Làm dịu, cấp ẩm và giảm viêm, phù hợp cho da bị cháy nắng hoặc kích ứng",
      Madecassoside:
        "Chiết xuất từ rau má, có tác dụng làm dịu, phục hồi và chống viêm mạnh",
      "Sodium Hyaluronate":
        "Dạng phân tử nhỏ hơn của hyaluronic acid, thấm sâu vào da để cấp ẩm",
      "Zinc Oxide": "Chất chống nắng vật lý, bảo vệ da khỏi tia UVA và UVB",
      "Titanium Dioxide":
        "Chất chống nắng vật lý, bảo vệ da khỏi tia UVA và UVB",
      Avobenzone: "Chất chống nắng hóa học, bảo vệ da khỏi tia UVA dài",
      "Surfactants nhẹ":
        "Chất làm sạch nhẹ nhàng không gây kích ứng, an toàn cho da nhạy cảm",
      "AHA/BHA":
        "Axit alpha và beta hydroxy, giúp tẩy tế bào chết, thông thoáng lỗ chân lông và làm đều màu da",
    };

    return (
      descriptions[ingredient] ||
      "Thành phần hoạt tính trong sản phẩm chăm sóc da"
    );
  };

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

      // Thêm đoạn này: Tự động submit form sau khi điền
      // Sử dụng setTimeout để đảm bảo form được cập nhật trước khi submit
      setTimeout(() => {
        // Kiểm tra lại xem formValues đã có đủ dữ liệu chưa
        if (formValues.skinType) {
          // Nếu là da nhạy cảm, hiển thị quy trình da nhạy cảm chi tiết
          if (formValues.skinType === "Da nhạy cảm") {
            const sensitiveSkinRoutine = {
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
            };
            setRecommendations(sensitiveSkinRoutine);

            // Lưu vào localStorage với giá trị tiếng Việt
            localStorage.setItem(
              "currentRoutine",
              JSON.stringify({
                skinType: formValues.skinType,
                concerns: formValues.concerns || [],
                routine: sensitiveSkinRoutine,
              })
            );
          } else {
            // Đối với các loại da khác, sử dụng quy trình từ bảng routines
            const selectedRoutine = routines[formValues.skinType];
            if (selectedRoutine) {
              setRecommendations(selectedRoutine);

              // Lưu vào localStorage với giá trị tiếng Việt
              localStorage.setItem(
                "currentRoutine",
                JSON.stringify({
                  skinType: formValues.skinType,
                  concerns: formValues.concerns || [],
                  routine: selectedRoutine,
                })
              );
            }
          }
        }
      }, 300);
    }
  }, [quizResults, form, autoFilled, routines]);

  useEffect(() => {
    // Fetch products for each step if not already done
    const fetchStepProducts = async () => {
      try {
        if (!allProducts || allProducts.length === 0) {
          const response = await api.get(endpoints.GET_PRODUCTS);
          console.log("Fetched products:", response.data.length);
          setAllProducts(response.data);

          // Lọc các sản phẩm cho da nhạy cảm để log kiểm tra
          const sensitiveProducts = response.data.filter(
            (product) =>
              product.skinTypeName === "Da nhạy cảm" ||
              product.skinTypeName === "Mọi loại da" ||
              (product.skinTypeName &&
                product.skinTypeName.toLowerCase().includes("nhạy cảm"))
          );
          console.log("Sản phẩm cho da nhạy cảm:", sensitiveProducts.length);

          // Lọc theo một số loại sản phẩm tiêu biểu
          const cleanserProducts = response.data.filter(
            (product) =>
              product.productTypeName &&
              (product.productTypeName.includes("Sữa rửa mặt") ||
                product.productTypeName.includes("Cleanser") ||
                product.productTypeName.includes("Gel rửa mặt"))
          );
          console.log("Sữa rửa mặt:", cleanserProducts.length);

          const serumProducts = response.data.filter(
            (product) =>
              product.productTypeName &&
              product.productTypeName.includes("Serum")
          );
          console.log("Serum:", serumProducts.length);

          const sunscreenProducts = response.data.filter(
            (product) =>
              product.productTypeName &&
              (product.productTypeName.includes("Kem chống nắng") ||
                product.productTypeName.includes("Sunscreen"))
          );
          console.log("Kem chống nắng:", sunscreenProducts.length);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
      }
    };

    fetchStepProducts();
  }, []); // No dependencies to avoid re-fetching

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

    // Nếu là da nhạy cảm, hiển thị quy trình da nhạy cảm chi tiết
    if (values.skinType === "Da nhạy cảm") {
      const sensitiveSkinRoutine = {
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
      };
      setRecommendations(sensitiveSkinRoutine);
      // Lưu vào localStorage với giá trị tiếng Việt
      localStorage.setItem(
        "currentRoutine",
        JSON.stringify({
          skinType: values.skinType,
          concerns: values.concerns || [],
          routine: sensitiveSkinRoutine,
        })
      );
    } else if (values.skinType === "Da dầu") {
      const oilySkinRoutine = {
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
      };
      setRecommendations(oilySkinRoutine);
      // Lưu vào localStorage với giá trị tiếng Việt
      localStorage.setItem(
        "currentRoutine",
        JSON.stringify({
          skinType: values.skinType,
          concerns: values.concerns || [],
          routine: oilySkinRoutine,
        })
      );
    } else {
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
    }

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
                Hệ thống tự động cung cấp quy trình chăm sóc da phù hợp với loại
                da của bạn
              </Paragraph>
            </motion.div>
          </div>

          <div className="p-8">
            {recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8 mt-0"
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
                        {recommendations.morning.map((step, index) =>
                          renderEnhancedRoutineStep(
                            step,
                            index,
                            index === recommendations.morning.length - 1,
                            "morning"
                          )
                        )}
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
                        {recommendations.evening.map((step, index) =>
                          renderEnhancedRoutineStep(
                            step,
                            index,
                            index === recommendations.evening.length - 1,
                            "evening"
                          )
                        )}
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
