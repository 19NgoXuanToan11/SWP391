import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Space,
  Row,
  Col,
  Image,
  InputNumber,
  Divider,
  Empty,
  Tag,
  message,
  Tooltip,
  Steps,
  Skeleton,
  notification,
  Spin,
  Checkbox,
  Select,
  Modal,
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowLeftOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  ShoppingOutlined,
  CarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  MinusOutlined,
  PlusOutlined,
  PercentageOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromotion,
  removePromotion,
} from "../../../../store/slices/cart/cartSlice";
import { PaymentSteps } from "../../../../components/payment-step/PaymentStep";
import { selectAuth } from "../../../../store/slices/auth/authSlice";
import {
  toggleWishlist,
  selectWishlistItems,
} from "../../../../store/slices/wishlist/wishlistSlice";
import axios from "axios";
import { useGetPromotionsQuery } from "../../../../services/api/beautyShopApi";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;

// Add a debugging function to better understand stock values
const isOutOfStock = (stockValue) => {
  console.log(
    `Checking stock value: ${stockValue}, type: ${typeof stockValue}`
  );
  return (
    stockValue === 0 ||
    stockValue === "0" ||
    stockValue === null ||
    stockValue === undefined ||
    !stockValue ||
    parseInt(stockValue || "0") <= 0
  );
};

// Update the verifyCurrentStockLevels function to better handle order history items
const verifyCurrentStockLevels = async (selectedCartItems) => {
  try {
    // Create a map to collect quantities by product ID
    const requestedQuantities = {};
    const itemsByProductId = {};

    // For each selected cart item, remember how many we want to purchase
    selectedCartItems.forEach((item) => {
      // Determine the correct ID to use for verification
      let productId = null;

      // For "buy again" products from order history
      if (item.productKey || item.fromOrder) {
        // Use the productId if available and it's a valid number
        if (item.productId && !isNaN(parseInt(item.productId))) {
          productId = parseInt(item.productId);
        }
        // Otherwise, fall back to regular id if it's a reasonable value
        else if (
          item.id &&
          !isNaN(parseInt(item.id)) &&
          parseInt(item.id) < 1000000000
        ) {
          productId = parseInt(item.id);
        }
        // If no valid ID is found, use a default ID but log the issue
        else {
          console.warn(`No valid product ID for verification: ${item.name}`);
          // Skip this item - no way to verify stock
          return;
        }
      } else {
        // For regular products, use the standard id
        productId = parseInt(item.productId || item.id);
      }

      if (!isNaN(productId)) {
        requestedQuantities[productId] =
          (requestedQuantities[productId] || 0) + (item.quantity || 1);
        itemsByProductId[productId] = item;
      }
    });

    // Verify each product's current stock level from the API
    const stockCheckResults = await Promise.all(
      Object.keys(requestedQuantities).map(async (productId) => {
        try {
          // Make a direct API call to get current stock
          const response = await axios.get(
            `https://localhost:7285/api/Product/${productId}`
          );

          // Log the real-time stock value
          console.log(`Real-time stock check for product ${productId}: 
            Current DB stock: ${response.data.stock}, 
            Requested quantity: ${requestedQuantities[productId]}`);

          // Check if we have enough stock
          const hasEnoughStock =
            response.data.stock != null &&
            parseInt(response.data.stock) >= requestedQuantities[productId];

          // Return result for this product
          return {
            productId,
            name: response.data.productName || itemsByProductId[productId].name,
            requestedQuantity: requestedQuantities[productId],
            actualStock: response.data.stock,
            hasEnoughStock,
            isOrderHistoryItem:
              itemsByProductId[productId].productKey ||
              itemsByProductId[productId].fromOrder,
          };
        } catch (error) {
          console.error(
            `Error checking stock for product ${productId}:`,
            error
          );
          return {
            productId,
            name: itemsByProductId[productId]?.name || "Unknown product",
            hasEnoughStock: false,
            error: true,
            isOrderHistoryItem:
              itemsByProductId[productId]?.productKey ||
              itemsByProductId[productId]?.fromOrder,
          };
        }
      })
    );

    // Filter for items with insufficient stock
    const insufficientStockItems = stockCheckResults.filter(
      (item) => !item.hasEnoughStock
    );

    if (insufficientStockItems.length > 0) {
      return {
        success: false,
        insufficientStockItems,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error during stock verification:", error);
    return {
      success: false,
      error: "Có lỗi xảy ra khi kiểm tra số lượng tồn kho. Vui lòng thử lại.",
    };
  }
};

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleConfirmClearCart = () => {
    dispatch(clearCart());
    message.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
    setIsOpen(false);
  };

  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useSelector(selectAuth);
  const [loading, setLoading] = React.useState(false);

  // Thêm state để lưu trữ sản phẩm không tồn tại
  const [nonExistentProducts, setNonExistentProducts] = React.useState([]);

  // Lấy danh sách wishlist từ Redux store
  const wishlistItems = useSelector(selectWishlistItems);

  // Kiểm tra sản phẩm có trong wishlist không
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Add state for price syncing
  const [isPriceSyncing, setIsPriceSyncing] = React.useState(false);

  // Add state for selected items
  const [selectedItems, setSelectedItems] = React.useState([]);

  // Add a ref to track whether we've shown out-of-stock modal
  const outOfStockModalShownRef = React.useRef(false);

  // Lấy danh sách mã khuyến mãi
  const { data: promotions, isLoading: isLoadingPromotions } =
    useGetPromotionsQuery();

  // Lấy thông tin mã khuyến mãi đã áp dụng từ Redux store
  const appliedPromotion = useSelector((state) => state.cart.promotion);
  const discountAmount = useSelector((state) => state.cart.discountAmount);

  // Tìm các mã khuyến mãi đang hoạt động
  const activePromotions = promotions?.filter((promo) => {
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    return now >= startDate && now <= endDate;
  });

  const handleQuantityChange = (id, value, index) => {
    // Get the current item before updating
    const item = cartItems[index];
    const oldQuantity = item.quantity;

    // Make sure we respect the stock limit
    const stockLimit = parseInt(item.stock) || 0;
    const newQuantity = Math.min(value, stockLimit > 0 ? stockLimit : value);

    // If stock limit is reached, show a warning
    if (stockLimit > 0 && value > stockLimit) {
      message.warning(
        `Số lượng tối đa có thể đặt là ${stockLimit} (tồn kho hiện tại)`
      );
    }

    console.log(
      `Updating quantity for item: ${item.name} at index ${index} from ${oldQuantity} to ${newQuantity}`
    );

    // Dispatch update action with adjusted quantity
    dispatch(updateQuantity({ id, quantity: newQuantity, index }));

    // Show a more detailed notification
    notification.success({
      message: "Đã cập nhật số lượng trong giỏ hàng",
      description: (
        <div className="flex items-start">
          <div className="mr-3">
            <Image
              src={item.image}
              alt={item.name}
              width={50}
              preview={false}
              className="rounded-md"
            />
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              Số lượng: {newQuantity}{" "}
              {newQuantity > oldQuantity
                ? `(+${newQuantity - oldQuantity})`
                : `(-${oldQuantity - newQuantity})`}
            </div>
            <div className="text-sm text-green-600 mt-1">
              Còn {stockLimit} sản phẩm trong kho
            </div>
          </div>
        </div>
      ),
      icon: <ShoppingCartOutlined className="text-green-500" />,
      placement: "bottomRight",
      duration: 3,
    });
  };

  const handleRemoveItem = (id, index) => {
    dispatch(removeFromCart({ id, index }));
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
  };

  const handleWishlistToggle = (item) => {
    const productData = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      brand: item.brand,
      description: item.description,
      stock: item.stock,
      discount: item.discount,
      originalPrice: item.originalPrice,
      rating: item.rating,
    };

    dispatch(toggleWishlist(productData));

    notification.success({
      message: "Danh sách yêu thích",
      description: `${item.name} đã được ${
        isInWishlist(item.id) ? "xóa khỏi" : "thêm vào"
      } danh sách yêu thích`,
      placement: "bottomRight",
    });
  };

  const calculateTotal = () => {
    if (selectedItems.length === 0) return 0;

    return cartItems.reduce((total, item, index) => {
      // Check if this item is selected using our composite ID
      if (selectedItems.includes(`${item.id}_${index}`)) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const calculateDiscount = () => {
    if (selectedItems.length === 0) return 0;

    return cartItems.reduce((total, item, index) => {
      // Check if this item is selected using our composite ID
      if (selectedItems.includes(`${item.id}_${index}`)) {
        return total + (item.originalPrice - item.price) * item.quantity;
      }
      return total;
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Cập nhật hàm tính toán tổng tiền sau khi áp dụng mã khuyến mãi
  const calculateFinalTotal = () => {
    const subtotal = calculateTotal();
    if (appliedPromotion) {
      // Đảm bảo không giảm giá quá tổng tiền
      return Math.max(0, subtotal - discountAmount);
    }
    return subtotal;
  };

  // Hàm áp dụng mã khuyến mãi
  const handleApplyPromotion = (promotionId) => {
    if (!promotionId) {
      dispatch(removePromotion());
      notification.info({
        message: "Đã hủy mã khuyến mãi",
        description: "Mã khuyến mãi đã được gỡ bỏ khỏi giỏ hàng của bạn.",
        placement: "bottomRight",
        icon: <TagOutlined style={{ color: "#1890ff" }} />,
      });
      return;
    }

    // Kiểm tra nếu không có sản phẩm nào được chọn
    if (selectedItems.length === 0) {
      notification.warning({
        message: "Không thể áp dụng khuyến mãi",
        description:
          "Vui lòng chọn ít nhất một sản phẩm trước khi áp dụng mã khuyến mãi.",
        placement: "bottomRight",
        icon: <InfoCircleOutlined style={{ color: "orange" }} />,
      });
      return;
    }

    const selectedPromotion = promotions.find(
      (p) => p.promotionId == promotionId
    );
    if (selectedPromotion) {
      dispatch(applyPromotion(selectedPromotion));

      // Tính số tiền sẽ giảm
      const subtotal = calculateTotal();
      const discountValue =
        (subtotal * selectedPromotion.discountPercentage) / 100;

      notification.success({
        message: "Áp dụng mã khuyến mãi thành công",
        description: (
          <div>
            <p>Đã áp dụng: {selectedPromotion.promotionName}</p>
            <p>
              Giảm giá: {selectedPromotion.discountPercentage}% tổng giá trị đơn
              hàng
            </p>
            <p>Số tiền giảm: {formatPrice(discountValue)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Hạn sử dụng:{" "}
              {new Date(selectedPromotion.startDate).toLocaleDateString(
                "vi-VN"
              )}{" "}
              -{" "}
              {new Date(selectedPromotion.endDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        ),
        placement: "bottomRight",
        duration: 5,
        icon: <PercentageOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };

  const handleCheckout = async () => {
    // Reset the ref at the start of each checkout attempt
    outOfStockModalShownRef.current = false;

    // First, check if any selected items are out of stock
    const outOfStockItems = [];

    for (const compositeId of selectedItems) {
      const [itemId, indexStr] = compositeId.split("_");
      const index = parseInt(indexStr);
      const item = cartItems[index];

      console.log(
        `[DEBUG] Checking item: ${item.name}, Stock: ${
          item.stock
        }, Type: ${typeof item.stock}`
      );

      // Super strict check for out-of-stock
      if (isOutOfStock(item.stock)) {
        console.log(`[CRITICAL] Out of stock found: ${item.name}`);
        outOfStockItems.push(item);
      }
    }

    // If we have out-of-stock items, show modal and STOP
    if (outOfStockItems.length > 0) {
      console.log(
        `[BLOCK] Blocking checkout - ${outOfStockItems.length} out-of-stock items`
      );
      outOfStockModalShownRef.current = true;

      // Use await with Modal to ensure the flow stops
      await new Promise((resolve) => {
        Modal.error({
          title: "Không thể tiến hành thanh toán",
          content: (
            <div>
              <p>Các sản phẩm sau đã hết hàng:</p>
              <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
                {outOfStockItems.map((item) => (
                  <li key={item.id} style={{ marginBottom: "5px" }}>
                    <strong>{item.name}</strong> (Số lượng trong kho:{" "}
                    {item.stock || 0})
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: "10px" }}>
                Vui lòng xóa các sản phẩm này khỏi giỏ hàng hoặc bỏ chọn để tiếp
                tục thanh toán.
              </p>
            </div>
          ),
          onOk: () => {
            console.log("[MODAL] User acknowledged out-of-stock error");
            resolve();
          },
        });
      });

      console.log("[BLOCK] Returning early - out of stock items");
      return; // CRITICAL: Stop execution here
    }

    // Regular empty cart check
    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    // Authentication check
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để tiếp tục thanh toán");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    try {
      setLoading(true);

      // Lấy các sản phẩm đã chọn
      let selectedCartItems = cartItems.filter((item, index) =>
        selectedItems.includes(`${item.id}_${index}`)
      );

      // NEW: Verify real-time stock levels before proceeding
      message.loading({
        content: "Đang kiểm tra tồn kho...",
        key: "stockCheck",
      });
      const stockVerification = await verifyCurrentStockLevels(
        selectedCartItems
      );

      // If verification failed, show error and stop
      if (!stockVerification.success) {
        message.error({
          content: "Kiểm tra tồn kho thất bại",
          key: "stockCheck",
        });

        if (stockVerification.insufficientStockItems?.length > 0) {
          // Show modal with insufficient stock items
          Modal.error({
            title: "Không thể tiến hành thanh toán",
            content: (
              <div>
                <p>Số lượng trong kho không đủ cho các sản phẩm sau:</p>
                <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
                  {stockVerification.insufficientStockItems.map((item) => (
                    <li key={item.productId} style={{ marginBottom: "5px" }}>
                      <strong>{item.name}</strong> (Bạn yêu cầu:{" "}
                      {item.requestedQuantity}, Hiện có: {item.actualStock || 0}
                      )
                    </li>
                  ))}
                </ul>
                <p style={{ marginTop: "10px" }}>
                  Có thể người khác vừa mua sản phẩm này. Vui lòng cập nhật giỏ
                  hàng và thử lại.
                </p>
              </div>
            ),
          });
          setLoading(false);
          return;
        }

        if (stockVerification.error) {
          message.error(stockVerification.error);
          setLoading(false);
          return;
        }
      }

      message.success({ content: "Đủ hàng để xử lý", key: "stockCheck" });

      // Kiểm tra và xử lý ID người dùng
      let userId = user.id;

      // Tính toán tổng giá trị đơn hàng
      const orderTotal = calculateTotal();

      // Tính toán giá cuối cùng sau khi áp dụng khuyến mãi
      const finalTotal = calculateFinalTotal();

      // Xử lý và lọc các sản phẩm hợp lệ
      let orderItems = [];
      for (const item of selectedCartItems) {
        let productId;

        try {
          // Đảm bảo productId là số nguyên hợp lệ
          if (item.productId && !isNaN(parseInt(item.productId))) {
            productId = parseInt(item.productId);
          } else if (item.id && !isNaN(parseInt(item.id))) {
            productId = parseInt(item.id);
          } else {
            console.warn("Bỏ qua sản phẩm có ID không hợp lệ:", item);
            continue;
          }

          // Kiểm tra nếu đây là sản phẩm từ đơn hàng cũ (có parentOrderStatus)
          // Các sản phẩm này thường có ID tạm thời rất lớn (timestamp)
          if (
            item.parentOrderStatus &&
            (productId > 1000000000 || item.fromOrder)
          ) {
            console.log("Phát hiện sản phẩm từ đơn hàng cũ:", item.name);
            console.log(
              `Sản phẩm "${item.name}" từ đơn hàng cũ có ID: ${productId}`
            );
            
            // Lấy ID gốc từ sản phẩm nếu có
            if (item.originalProductId) {
              productId = item.originalProductId;
              console.log(`Đã sử dụng ID gốc cho "${item.name}": ${productId}`);
            } else {
              // Nếu không có ID gốc, tìm sản phẩm tương ứng trong danh sách sản phẩm
              const matchingProduct = cartItems.find(p => 
                p.name === item.name && 
                p.price === item.price && 
                !p.parentOrderStatus
              );
              
              if (matchingProduct) {
                productId = matchingProduct.productId || matchingProduct.id;
                console.log(`Đã tìm thấy ID tương ứng cho "${item.name}": ${productId}`);
              } else {
                console.warn(`Không tìm thấy ID tương ứng cho sản phẩm "${item.name}"`);
                
                // Thử tìm sản phẩm từ API bằng tên sản phẩm
                try {
                  // Tìm kiếm sản phẩm từ API
                  const searchResponse = await axios.get(
                    `https://localhost:7285/api/Product/search?searchTerm=${encodeURIComponent(item.name)}`
                  );
                  
                  if (searchResponse.data && searchResponse.data.length > 0) {
                    // Tìm sản phẩm có tên và giá tương tự
                    const apiProduct = searchResponse.data.find(p => 
                      p.productName === item.name && 
                      Math.abs(p.price - item.price) < 1000 // Cho phép sai lệch giá tối đa 1000đ
                    );
                    
                    if (apiProduct) {
                      productId = apiProduct.productId;
                      console.log(`Đã tìm thấy ID từ API cho "${item.name}": ${productId}`);
                    } else {
                      // Nếu không tìm thấy sản phẩm chính xác, sử dụng sản phẩm đầu tiên
                      productId = searchResponse.data[0].productId;
                      console.log(`Đã sử dụng ID từ sản phẩm tương tự cho "${item.name}": ${productId}`);
                    }
                  } else {
                    console.warn(`Không tìm thấy sản phẩm tương ứng trên API cho "${item.name}"`);
                    // Bỏ qua sản phẩm này thay vì sử dụng ID tạm thời
                    continue;
                  }
                } catch (apiError) {
                  console.error(`Lỗi khi tìm kiếm sản phẩm từ API:`, apiError);
                  // Bỏ qua sản phẩm này thay vì sử dụng ID tạm thời
                  continue;
                }
              }
            }
          }

          if (productId <= 0) {
            console.warn("Bỏ qua sản phẩm có ID không hợp lệ (ID <= 0):", item);
            continue;
          }

          // Thêm item hợp lệ vào danh sách
          orderItems.push({
            productId: productId,
            quantity: parseInt(item.quantity) || 1,
            price: parseFloat(item.price) || 0,
          });
        } catch (error) {
          console.error("Lỗi khi xử lý sản phẩm:", error);
          // Bỏ qua sản phẩm lỗi
        }
      }

      // Kiểm tra nếu không còn sản phẩm nào hợp lệ
      if (orderItems.length === 0) {
        message.error(
          "Không có sản phẩm hợp lệ để đặt hàng. Vui lòng thử lại!"
        );
        setLoading(false);
        return;
      }

      // Log để kiểm tra
      console.log("Danh sách sản phẩm đã lọc:", orderItems);

      // Tạo đối tượng đơn hàng đúng định dạng
      const createOrderDTO = {
        userId: parseInt(userId),
        items: orderItems,
        promotionId: appliedPromotion?.promotionId
          ? parseInt(appliedPromotion.promotionId)
          : null,
        promotionDiscount: discountAmount || 0,
        subtotal: orderTotal,
        total: finalTotal,
      };

      console.log("Gửi đơn hàng:", JSON.stringify(createOrderDTO));

      const res = await axios.post(
        "https://localhost:7285/api/Order",
        createOrderDTO,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Lưu thông tin đơn hàng vào sessionStorage để sử dụng ở trang thanh toán
      try {
        const orderInfo = {
          orderId: res.data.orderId,
          promotionId: appliedPromotion?.promotionId || null,
          promotionDiscount: discountAmount || 0,
          subtotal: orderTotal,
          total: finalTotal,
        };
        sessionStorage.setItem(
          `order_info_${res.data.orderId}`,
          JSON.stringify(orderInfo)
        );
        console.log(
          "Đã lưu thông tin đơn hàng vào session storage:",
          orderInfo
        );
      } catch (sessionError) {
        console.error(
          "Lỗi khi lưu thông tin đơn hàng vào session storage:",
          sessionError
        );
      }

      // Nếu đã sử dụng mã khuyến mãi, xóa mã khuyến mãi khỏi giỏ hàng
      if (appliedPromotion) {
        dispatch(removePromotion());
      }

      // Ensure we have a valid order ID before navigating
      if (!res.data.orderId) {
        throw new Error("Không nhận được mã đơn hàng từ server");
      }

      const orderId = res.data.orderId;

      // Show success message and navigate
      message.success(
        `Đơn hàng #${orderId} đã được tạo thành công! Đang chuyển đến trang thanh toán...`
      );

      // Use a more explicit navigation with explicit order ID to prevent navigation to empty URLs
      const paymentUrl = `/payment/${orderId}`;
      console.log(`Navigating to payment page: ${paymentUrl}`);
      navigate(paymentUrl);
    } catch (e) {
      console.log("Lỗi khi tạo đơn hàng:", e);

      // Xử lý lỗi chi tiết từ API
      if (e.response && e.response.data) {
        console.error("Chi tiết lỗi API:", e.response.data);

        if (e.response.data.message) {
          message.error(`Lỗi: ${e.response.data.message}`);
        } else if (e.response.data.errors) {
          // Hiển thị các lỗi validation từ API
          const errorMessages = [];
          for (const key in e.response.data.errors) {
            if (Array.isArray(e.response.data.errors[key])) {
              errorMessages.push(...e.response.data.errors[key]);
            }
          }

          if (errorMessages.length > 0) {
            message.error(`Lỗi: ${errorMessages[0]}`);
          } else {
            message.error("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!");
          }
        } else {
          message.error(`Lỗi ${e.response.status}: Không thể tạo đơn hàng`);
        }
      } else {
        message.error("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = () => {
    handleOpenModal();
  };

  // Add validation for cart items on component mount
  useEffect(() => {
    const validateAndCleanCart = () => {
      if (cartItems.length === 0) return;

      // Log all cart items for debugging
      console.log("Validating cart items:", JSON.stringify(cartItems, null, 2));

      // Find items with invalid IDs
      const validItems = [];
      const invalidItems = [];

      cartItems.forEach((item) => {
        // Skip completely empty or null items
        if (!item) {
          invalidItems.push(item);
          return;
        }

        // For products with any name identifier, we consider them valid
        if (item.name || item.productName) {
          // Always ensure we have proper defaults for missing properties
          const validItem = {
            ...item,
            id: item.id || Date.now(), // Keep the ID even if it's a temporary one
            productId: item.productId || item.id || Date.now(),
            name: item.name || item.productName || "Sản phẩm không xác định",
            productName:
              item.productName || item.name || "Sản phẩm không xác định",
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1,
            image: item.image || item.productImages || "",
            productImages: item.productImages || item.image || "",
            brand: item.brand || item.brandName || "",
            brandName: item.brandName || item.brand || "",
            stock: item.stock !== undefined ? item.stock : 0,
            discount: item.discount || 0,
            description: item.description || "",
            // Preserve product key and fromOrder for identification
            productKey: item.productKey || null,
            fromOrder: item.fromOrder || null,
          };
          validItems.push(validItem);
        } else {
          // Invalid item - has no name at all
          invalidItems.push(item);
        }
      });

      // If we found invalid items, update the cart
      if (invalidItems.length > 0) {
        console.log(
          "Removing completely invalid items from cart:",
          invalidItems
        );

        // Update the cart with only valid items
        dispatch({
          type: "cart/setCart",
          payload: {
            items: validItems,
            total: validItems.reduce(
              (total, item) =>
                total +
                (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1),
              0
            ),
            quantity: validItems.reduce(
              (total, item) => total + (parseInt(item.quantity) || 1),
              0
            ),
            promotion: null,
            discountAmount: 0,
          },
        });

        // Notify the user only if we removed items that had any identifiable information
        const namedInvalidItems = invalidItems.filter(
          (item) => item && (item.name || item.productName)
        );
        if (namedInvalidItems.length > 0) {
          message.warning({
            content: `Đã xóa ${namedInvalidItems.length} sản phẩm không hợp lệ khỏi giỏ hàng`,
            duration: 3,
          });
        }
      }
    };

    validateAndCleanCart();
  }, [cartItems, dispatch]);

  useEffect(() => {
    // Khi component mount hoặc khi thông tin người dùng thay đổi
    if (isAuthenticated && user) {
      // Tải giỏ hàng từ localStorage
      try {
        const allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
        const userId = user.id;

        // Nếu có giỏ hàng của người dùng này trong localStorage
        if (allCarts[userId]) {
          // Cập nhật Redux store với giỏ hàng từ localStorage
          // Đây là việc đồng bộ thủ công, thay vì dispatch loadCart
          dispatch({
            type: "cart/setCart",
            payload: allCarts[userId],
          });
        }
      } catch (error) {
        console.error("Error loading cart on page load:", error);
      }
    }
  }, [dispatch, isAuthenticated, user]);

  // Add useEffect for checking if products still exist in database
  useEffect(() => {
    const checkProductsExist = async () => {
      if (cartItems.length === 0) return;

      try {
        const validItems = [];
        const nonExistentItems = [];

        // Check each product asynchronously
        await Promise.all(
          cartItems.map(async (item) => {
            try {
              // Skip validation for invalid items
              if (!item) {
                nonExistentItems.push(item);
                return;
              }

              // Even for products from order history (with productKey or fromOrder),
              // we should still verify and update their stock levels
              let isOrderHistoryItem = item.productKey || item.fromOrder;

              // Determine which ID to use for API query
              let productIdForAPI = null;

              // For "buy again" products, use their productId if available
              if (isOrderHistoryItem) {
                // If it has a valid numeric productId, use that
                if (item.productId && !isNaN(parseInt(item.productId))) {
                  productIdForAPI = parseInt(item.productId);
                  console.log(
                    `Using productId ${productIdForAPI} for order history item: ${item.name}`
                  );
                }
                // Otherwise try using the regular id
                else if (
                  item.id &&
                  !isNaN(parseInt(item.id)) &&
                  parseInt(item.id) < 1000000000
                ) {
                  productIdForAPI = parseInt(item.id);
                  console.log(
                    `Using id ${productIdForAPI} for order history item: ${item.name}`
                  );
                }

                // No valid ID found, keep original item but mark potential issue
                if (!productIdForAPI) {
                  console.log(
                    `No valid API ID for order history item: ${item.name}, keeping as is`
                  );
                  validItems.push({
                    ...item,
                    stock: item.stock || 0, // Ensure a numeric stock value
                  });
                  return;
                }
              } else {
                // For regular products, use the standard ID
                if (isNaN(parseInt(item.id))) {
                  console.error(
                    `Invalid product ID: ${item ? item.id : "undefined"}`
                  );
                  nonExistentItems.push(item);
                  return;
                }
                productIdForAPI = parseInt(item.id);
              }

              // Now we have a valid ID to check with the API
              try {
                const response = await axios.get(
                  `https://localhost:7285/api/Product/${productIdForAPI}`
                );

                // Debug the stock value from API
                console.log(
                  `Product ${productIdForAPI} stock from API:`,
                  response.data.stock
                );

                // Create updated item with stock information
                const updatedItem = {
                  ...item,
                  // Keep the original ID structure for tracking
                  id: isOrderHistoryItem ? item.id : productIdForAPI,
                  productId: productIdForAPI,
                  // Directly assign stock from API
                  stock: response.data.stock,
                  // Update with the latest price from the API if not from order history
                  // For order history items, preserve their original price
                  price: isOrderHistoryItem
                    ? item.price
                    : response.data.price || item.price,
                  originalPrice: isOrderHistoryItem
                    ? item.originalPrice
                    : response.data.originalPrice || item.price,
                };

                validItems.push(updatedItem);

                // Log successful update
                if (isOrderHistoryItem) {
                  console.log(
                    `Updated stock for order history item: ${item.name} to ${response.data.stock}`
                  );
                }
              } catch (error) {
                console.error(
                  `Error checking product ${productIdForAPI}:`,
                  error
                );

                // For order history items with API errors, still keep them but mark as out of stock
                if (isOrderHistoryItem) {
                  console.log(
                    `Keeping order history item despite API error: ${item.name}, setting stock to 0`
                  );
                  validItems.push({
                    ...item,
                    stock: 0, // Mark as out of stock due to API error
                  });
                } else if (
                  error.response &&
                  (error.response.status === 400 ||
                    error.response.status === 404)
                ) {
                  // For regular items, handle as not found
                  nonExistentItems.push(item);
                }
              }
            } catch (error) {
              console.error(
                `Error processing item ${item ? item.id : "undefined"}:`,
                error
              );
              nonExistentItems.push(item);
            }
          })
        );

        // If we found non-existent products, update the cart
        if (nonExistentItems.length > 0) {
          console.log("Products no longer exist:", nonExistentItems);

          // Update the cart with only valid items
          dispatch({
            type: "cart/setCart",
            payload: {
              items: validItems,
              total: validItems.reduce(
                (total, item) =>
                  total +
                  (parseFloat(item.price) || 0) *
                    (parseInt(item.quantity) || 1),
                0
              ),
              quantity: validItems.reduce(
                (total, item) => total + (parseInt(item.quantity) || 1),
                0
              ),
              promotion: null,
              discountAmount: 0,
            },
          });

          // Show notification about removed products
          if (nonExistentItems.length > 0) {
            const removedNames = nonExistentItems.map(
              (item) =>
                item.name || item.productName || "Sản phẩm không xác định"
            );
            message.warning({
              content: `Một số sản phẩm đã bị xóa khỏi giỏ hàng do không còn tồn tại: ${removedNames.join(
                ", "
              )}`,
              duration: 5,
            });
          }
        } else if (JSON.stringify(cartItems) !== JSON.stringify(validItems)) {
          // Update cart if any stock levels have changed
          console.log("Updating cart with refreshed stock levels");
          dispatch({
            type: "cart/setCart",
            payload: {
              items: validItems,
              total: validItems.reduce(
                (total, item) =>
                  total +
                  (parseFloat(item.price) || 0) *
                    (parseInt(item.quantity) || 1),
                0
              ),
              quantity: validItems.reduce(
                (total, item) => total + (parseInt(item.quantity) || 1),
                0
              ),
              promotion: null,
              discountAmount: 0,
            },
          });
        }
      } catch (error) {
        console.error("Error checking products existence:", error);
      }
    };

    // Run the check when the component mounts or when the cart changes
    checkProductsExist();
  }, [cartItems, dispatch]);

  // Add useEffect for price syncing
  useEffect(() => {
    const syncProductPrices = async () => {
      if (cartItems.length === 0 || isPriceSyncing) return;

      setIsPriceSyncing(true);
      try {
        const updatedItems = await Promise.all(
          cartItems.map(async (item) => {
            try {
              // Skip API calls for products with our unique identifiers
              // These are from order history and their prices are predetermined
              if (
                !item ||
                item.id > 1000000000 ||
                item.source ||
                item.addedAt ||
                item.orderIndex !== undefined ||
                item.fromOrder ||
                item.originalProductId
              ) {
                console.log(
                  `Skipping API call for product from order history: ${
                    item ? item.name : "undefined"
                  } with ID ${item ? item.id : "undefined"}`
                );
                return item;
              }

              // Ensure the ID is valid
              if (!item.id || isNaN(parseInt(item.id))) {
                console.error(
                  `Invalid product ID: ${item ? item.id : "undefined"}`
                );
                // Add to nonExistentProducts to be removed later
                setNonExistentProducts((prev) => [...prev, item]);
                return item;
              }

              const productId = parseInt(item.id);
              const response = await axios.get(
                `https://localhost:7285/api/Product/${productId}`
              );

              // If price has changed, update the item
              if (response.data.price !== item.price) {
                return {
                  ...item,
                  price: response.data.price,
                  originalPrice:
                    response.data.originalPrice || response.data.price,
                };
              }
              return item;
            } catch (error) {
              console.error(
                `Error fetching product ${item ? item.id : "undefined"}:`,
                error
              );
              // If the error is a 400 Bad Request, it likely means the product doesn't exist
              if (
                error.response &&
                (error.response.status === 400 || error.response.status === 404)
              ) {
                setNonExistentProducts((prev) => [...prev, item]);
              }
              return item;
            }
          })
        );

        // Check if any prices were updated
        const pricesChanged = updatedItems.some(
          (newItem, index) => newItem.price !== cartItems[index].price
        );

        if (pricesChanged) {
          // Update cart with new prices
          dispatch({
            type: "cart/setCart",
            payload: {
              items: updatedItems,
              total: updatedItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              ),
              quantity: updatedItems.reduce(
                (total, item) => total + item.quantity,
                0
              ),
            },
          });

          message.info("Giá sản phẩm trong giỏ hàng đã được cập nhật");
        }
      } catch (error) {
        console.error("Error syncing product prices:", error);
      } finally {
        setIsPriceSyncing(false);
      }
    };

    syncProductPrices();
  }, [cartItems, dispatch]);

  // Initialize selected items with all items when component mounts or cart changes
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      // Use a more unique identifier to ensure distinct selection for each cart item
      setSelectedItems(
        cartItems.map((item, index) => {
          // Use a combination of ID and index if there are duplicate IDs
          return `${item.id}_${index}`;
        })
      );
    } else {
      setSelectedItems([]);
    }
  }, [cartItems]);

  // Handle select/deselect all
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      // Only select in-stock items
      setSelectedItems(
        cartItems
          .filter(
            (item) =>
              item.stock !== 0 &&
              item.stock !== null &&
              item.stock !== "0" &&
              parseInt(item.stock || 0) > 0
          )
          .map((item, index) => `${item.id}_${index}`)
      );
    } else {
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
  const handleItemSelect = (id, index, checked) => {
    const itemId = `${id}_${index}`;
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) =>
        prev.filter((selectedId) => selectedId !== itemId)
      );
    }
  };

  if (!cartItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress Steps - Cập nhật current={0} vì đang ở bước giỏ hàng */}
        <div className="mb-8">
          <PaymentSteps current={0} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Link to="/product">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-pink-50 
                  text-gray-600 hover:text-pink-500 font-medium transition-all duration-300
                  shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200"
              >
                <ArrowLeftOutlined className="text-lg" />
                <span>Tiếp Tục Mua Sắm</span>
              </button>
            </Link>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-red-50 
                  text-gray-600 hover:text-red-500 font-medium transition-all duration-300
                  shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200"
              >
                <DeleteOutlined className="text-lg" />
                <span>Xóa Tất Cả</span>
              </button>
            )}
          </div>
          <Title level={2} className="!mb-0 flex items-center gap-3">
            <ShoppingCartOutlined className="text-pink-500" />
            Giỏ Hàng Của Bạn
            <Tag color="pink" className="ml-2">
              {cartItems.length} sản phẩm
            </Tag>
          </Title>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12 rounded-3xl shadow-md">
            <Empty
              imageStyle={{ height: 200 }}
              description={
                <Space direction="vertical" size="large">
                  <Title level={3} className="!mb-0">
                    Giỏ hàng của bạn đang trống
                  </Title>
                  <Paragraph type="secondary">
                    Hãy thêm một số sản phẩm vào giỏ hàng để tiến hành thanh
                    toán
                  </Paragraph>
                  <Link to="/product" className="flex justify-center">
                    <button
                      type="button"
                      className="flex items-center gap-3 px-6 py-3 text-white font-medium rounded-full
                        bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600
                        transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                        active:scale-95"
                    >
                      <ShoppingOutlined className="text-xl" />
                      <span>Khám Phá Sản Phẩm</span>
                    </button>
                  </Link>
                </Space>
              }
            />
          </Card>
        ) : (
          <Row gutter={24}>
            <Col xs={24} lg={16}>
              <Card className="rounded-3xl shadow-md mb-6">
                {/* Confirmation Modal */}
                <Modal
                  title={
                    <div className="flex items-center gap-2">
                      <DeleteOutlined className="text-red-500" />
                      <span>Xác nhận xóa</span>
                    </div>
                  }
                  open={isOpen}
                  onCancel={handleCloseModal}
                  footer={[
                    <Button key="cancel" onClick={handleCloseModal}>
                      Hủy
                    </Button>,
                    <Button
                      key="confirm"
                      type="primary"
                      danger
                      onClick={handleConfirmClearCart}
                    >
                      Xóa tất cả
                    </Button>,
                  ]}
                >
                  <p>
                    Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng
                    không?
                  </p>
                </Modal>
                {cartItems.length > 0 && (
                  <div className="mb-4 flex items-center">
                    <Checkbox
                      onChange={(e) => handleSelectAllChange(e)}
                      checked={
                        selectedItems.length === cartItems.length &&
                        cartItems.length > 0 &&
                        cartItems.every((item, index) =>
                          selectedItems.includes(`${item.id}_${index}`)
                        )
                      }
                    >
                      <Text strong>
                        Chọn tất cả ({selectedItems.length}/{cartItems.length}{" "}
                        sản phẩm)
                      </Text>
                    </Checkbox>
                  </div>
                )}
                <Divider className="my-2" />

                {cartItems.map((item, index) => (
                  <div key={`${item.id}_${index}`}>
                    <div className="flex gap-6 py-6">
                      <div className="flex items-center mr-2">
                        <Checkbox
                          checked={selectedItems.includes(
                            `${item.id}_${index}`
                          )}
                          onChange={(e) =>
                            handleItemSelect(item.id, index, e.target.checked)
                          }
                          disabled={isOutOfStock(item.stock)} // Disable checkbox for out-of-stock items
                        />
                      </div>
                      <div className="relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={140}
                          height={140}
                          className="rounded-2xl object-cover"
                          preview={false}
                        />
                        {item.discount > 0 && (
                          <div className="absolute top-2 left-2">
                            <Tag color="red" className="px-2 py-1">
                              -{item.discount}%
                            </Tag>
                          </div>
                        )}
                        {isOutOfStock(item.stock) && (
                          <div className="absolute top-2 right-2">
                            <Tag color="error" className="px-2 py-1">
                              Hết hàng
                            </Tag>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <Title level={4} className="!mb-1">
                              {item.name}
                            </Title>
                            <Space size="small" className="mb-2">
                              {item.isNew && (
                                <Tag color="blue">Sản phẩm mới</Tag>
                              )}
                              {isOutOfStock(item.stock) && (
                                <Tag color="error">Hết hàng</Tag>
                              )}
                            </Space>
                            {item.color && (
                              <div className="mt-1">
                                <Text type="secondary" className="text-sm">
                                  Màu sắc: {item.color}
                                </Text>
                              </div>
                            )}
                            {item.size && (
                              <div className="mt-1">
                                <Text type="secondary" className="text-sm">
                                  Kích thước: {item.size}
                                </Text>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <Title level={4} className="!mb-1 text-pink-500">
                              {formatPrice(item.price)}
                            </Title>
                            {item.originalPrice > item.price && (
                              <Text delete type="secondary" className="text-sm">
                                {formatPrice(item.originalPrice)}
                              </Text>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <Space size="large">
                            <div className="flex flex-col">
                              <Text className="text-sm font-medium text-gray-600 mb-2">
                                Số lượng:
                              </Text>
                              <div className="flex items-center space-x-2">
                                <Button
                                  icon={<MinusOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(
                                      item.id,
                                      Math.max(1, item.quantity - 1),
                                      index
                                    );
                                  }}
                                  className="border-gray-300 hover:border-pink-400 hover:text-pink-500 transition-colors"
                                  disabled={
                                    item.quantity <= 1 ||
                                    isOutOfStock(item.stock)
                                  }
                                />
                                <InputNumber
                                  min={1}
                                  max={
                                    parseInt(item.stock) > 0
                                      ? parseInt(item.stock)
                                      : 1
                                  }
                                  value={item.quantity}
                                  onChange={(value) => {
                                    if (value === null || isNaN(value)) {
                                      message.warning("Vui lòng chỉ nhập số");
                                      return;
                                    }
                                    handleQuantityChange(
                                      item.id,
                                      Math.floor(Math.abs(value)) || 1,
                                      index
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    // Cho phép các phím điều khiển và số
                                    const allowedKeys = [
                                      "Backspace",
                                      "Delete",
                                      "ArrowLeft",
                                      "ArrowRight",
                                      "Tab",
                                    ];

                                    if (
                                      !allowedKeys.includes(e.key) &&
                                      !/^[0-9]$/.test(e.key) &&
                                      !e.ctrlKey &&
                                      !e.metaKey
                                    ) {
                                      e.preventDefault();
                                      message.warning("Vui lòng chỉ nhập số");
                                    }
                                  }}
                                  className="w-16 text-center !border-gray-200"
                                  controls={false}
                                  disabled={isOutOfStock(item.stock)}
                                />
                                <Button
                                  icon={<PlusOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(
                                      item.id,
                                      Math.min(
                                        item.stock || 0,
                                        item.quantity + 1
                                      ),
                                      index
                                    );
                                  }}
                                  className="border-gray-300 hover:border-pink-400 hover:text-pink-500 transition-colors"
                                  disabled={
                                    item.quantity >= (item.stock || 0) ||
                                    isOutOfStock(item.stock)
                                  }
                                />
                              </div>
                            </div>
                          </Space>
                          <Space>
                            <Tooltip title="Xóa sản phẩm">
                              <Button
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(item.id, index);
                                }}
                                className="border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300"
                              />
                            </Tooltip>
                            <Button
                              icon={<SyncOutlined />}
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  message.loading({
                                    content: "Đang cập nhật tồn kho...",
                                    key: "refreshStock",
                                  });
                                  const response = await axios.get(
                                    `https://localhost:7285/api/Product/${item.id}`
                                  );

                                  // Update the item with the latest stock
                                  const updatedItem = {
                                    ...item,
                                    stock: response.data.stock,
                                  };

                                  // Create a new array with the updated item
                                  const updatedCartItems = [...cartItems];
                                  updatedCartItems[index] = updatedItem;

                                  // Update cart in Redux
                                  dispatch({
                                    type: "cart/setCart",
                                    payload: {
                                      items: updatedCartItems,
                                      total: updatedCartItems.reduce(
                                        (total, item) =>
                                          total + item.price * item.quantity,
                                        0
                                      ),
                                      quantity: updatedCartItems.reduce(
                                        (total, item) => total + item.quantity,
                                        0
                                      ),
                                    },
                                  });

                                  message.success({
                                    content: `Đã cập nhật tồn kho: ${response.data.stock}`,
                                    key: "refreshStock",
                                  });
                                } catch (error) {
                                  console.error(
                                    "Error refreshing stock:",
                                    error
                                  );
                                  message.error({
                                    content: "Không thể cập nhật tồn kho",
                                    key: "refreshStock",
                                  });
                                }
                              }}
                              className="border-gray-300 hover:border-blue-400 hover:text-blue-500 transition-colors"
                              title="Cập nhật tồn kho"
                            />
                          </Space>
                        </div>
                      </div>
                    </div>
                    <Divider className="my-0" />
                  </div>
                ))}
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <div className="sticky top-6">
                <Card className="rounded-3xl shadow-md mb-6">
                  <Title level={4} className="flex items-center gap-2 mb-6">
                    <SafetyCertificateOutlined className="text-green-500" />
                    Tóm Tắt Đơn Hàng
                  </Title>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Text>Sản phẩm đã chọn</Text>
                      <Text>
                        {selectedItems.length}/{cartItems.length}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Tạm tính</Text>
                      <Text>{formatPrice(calculateTotal())}</Text>
                    </div>

                    {/* Phần mã khuyến mãi */}
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <TagOutlined className="text-orange-500 mr-2" />
                        <Text strong>Mã khuyến mãi</Text>
                      </div>

                      {!appliedPromotion ? (
                        <>
                          <Select
                            placeholder="Chọn mã khuyến mãi"
                            className="w-full"
                            loading={isLoadingPromotions}
                            onChange={handleApplyPromotion}
                            disabled={
                              selectedItems.length === 0 ||
                              cartItems.length === 0
                            }
                            suffixIcon={
                              <TagOutlined style={{ color: "#ff4d4f" }} />
                            }
                          >
                            {activePromotions?.map((promotion) => (
                              <Option
                                key={promotion.promotionId}
                                value={promotion.promotionId}
                              >
                                <div className="flex items-center">
                                  <PercentageOutlined className="text-red-500 mr-2" />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {promotion.promotionName} (Giảm{" "}
                                      {promotion.discountPercentage}%)
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Hiệu lực:{" "}
                                      {new Date(
                                        promotion.startDate
                                      ).toLocaleDateString("vi-VN")}{" "}
                                      -{" "}
                                      {new Date(
                                        promotion.endDate
                                      ).toLocaleDateString("vi-VN")}
                                    </span>
                                  </div>
                                </div>
                              </Option>
                            ))}
                          </Select>
                          <Text className="text-xs text-gray-500 block mt-1">
                            Chọn mã giảm giá để nhận ưu đãi cho đơn hàng của bạn
                          </Text>
                        </>
                      ) : (
                        <div className="border border-green-200 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between bg-green-50 px-3 py-2">
                            <div className="flex items-center">
                              <CheckCircleOutlined className="text-green-500 mr-2" />
                              <Text strong>Đã áp dụng mã giảm giá</Text>
                            </div>
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => handleApplyPromotion(null)}
                              size="small"
                              className="text-gray-500 hover:text-red-500"
                            />
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <Text strong>
                                {appliedPromotion.promotionName}
                              </Text>
                              <Tag color="green">
                                Giảm {appliedPromotion.discountPercentage}%
                              </Tag>
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              <div className="flex items-center">
                                <ClockCircleOutlined className="mr-1" />
                                <span>
                                  Hiệu lực:{" "}
                                  {new Date(
                                    appliedPromotion.startDate
                                  ).toLocaleDateString("vi-VN")}{" "}
                                  -{" "}
                                  {new Date(
                                    appliedPromotion.endDate
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                              <Text>Tiết kiệm</Text>
                              <Text className="text-green-600 font-medium">
                                -{formatPrice(discountAmount)}
                              </Text>
                            </div>
                          </div>
                        </div>
                      )}

                      {activePromotions &&
                        activePromotions.length > 0 &&
                        !appliedPromotion && (
                          <div className="mt-3">
                            <Text className="text-xs font-medium">
                              Mã giảm giá khả dụng ({activePromotions.length})
                            </Text>
                            <div className="mt-1 max-h-20 overflow-y-auto pr-1">
                              {activePromotions.map((promotion) => (
                                <div
                                  key={promotion.promotionId}
                                  className="flex items-center justify-between text-xs p-1.5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                  onClick={() =>
                                    handleApplyPromotion(promotion.promotionId)
                                  }
                                >
                                  <div className="flex items-center">
                                    <PercentageOutlined className="text-red-500 text-xs mr-1" />
                                    <span>{promotion.promotionName}</span>
                                  </div>
                                  <div>
                                    <Tag
                                      color="red"
                                      className="text-xs px-1 py-0"
                                    >
                                      {promotion.discountPercentage}%
                                    </Tag>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    <Divider className="my-4" />
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <Text>Tạm tính:</Text>
                        <Text>{formatPrice(calculateTotal())}</Text>
                      </div>

                      {appliedPromotion && (
                        <div className="flex justify-between">
                          <Text className="text-green-600">Giảm giá:</Text>
                          <Text className="text-green-600">
                            -{formatPrice(discountAmount)}
                          </Text>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <Text strong className="text-lg">
                          Tổng cộng:
                        </Text>
                        <Title
                          level={3}
                          className={`!m-0 ${
                            appliedPromotion
                              ? "text-green-600"
                              : "text-pink-500"
                          }`}
                        >
                          {formatPrice(calculateFinalTotal())}
                        </Title>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={
                      loading ||
                      selectedItems.length === 0 ||
                      // Ultra-strict check for out-of-stock items
                      cartItems.some((item, index) => {
                        if (!selectedItems.includes(`${item.id}_${index}`))
                          return false;

                        const stockValue = item.stock;
                        console.log(
                          `Button check: ${item.name}, Stock: ${stockValue}`
                        );
                        return isOutOfStock(stockValue);
                      })
                    }
                    onClick={(e) => {
                      e.preventDefault(); // Prevent any default action

                      // Final check for out-of-stock items
                      const outOfStockItems = cartItems.filter(
                        (item, index) => {
                          if (!selectedItems.includes(`${item.id}_${index}`))
                            return false;

                          const stockValue = item.stock;
                          return isOutOfStock(stockValue);
                        }
                      );

                      if (outOfStockItems.length > 0) {
                        console.log(
                          "[CRITICAL] Button click - found out of stock items!"
                        );

                        // This has to block everything
                        Modal.error({
                          title: "Không thể tiến hành thanh toán",
                          content: (
                            <div>
                              <p>Các sản phẩm sau đã hết hàng:</p>
                              <ul
                                style={{
                                  marginLeft: "20px",
                                  marginTop: "10px",
                                }}
                              >
                                {outOfStockItems.map((item) => (
                                  <li
                                    key={item.id}
                                    style={{ marginBottom: "5px" }}
                                  >
                                    <strong>{item.name}</strong> (Số lượng trong
                                    kho: {item.stock || 0})
                                  </li>
                                ))}
                              </ul>
                              <p style={{ marginTop: "10px" }}>
                                Vui lòng xóa các sản phẩm này khỏi giỏ hàng hoặc
                                bỏ chọn để tiếp tục thanh toán.
                              </p>
                            </div>
                          ),
                        });
                        return; // Stop execution
                      }

                      // If we got here, there are no out-of-stock items, so proceed with checkout
                      console.log("[DEBUG] Proceeding with checkout");
                      handleCheckout();
                    }}
                    className="w-full py-2 px-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 
                      text-white font-medium text-lg hover:from-pink-600 hover:to-purple-600 
                      transform hover:scale-105 transition-all duration-300 
                      flex items-center justify-center gap-3 shadow-lg hover:shadow-xl
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">
                          <SyncOutlined />
                        </span>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <SafetyCertificateOutlined className="text-xl" />
                        <span>Tiến Hành Thanh Toán</span>
                      </>
                    )}
                  </button>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

export default CartPage;
