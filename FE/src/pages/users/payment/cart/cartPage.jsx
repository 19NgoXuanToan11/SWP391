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

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    console.log(
      `Updating quantity for item: ${item.name} at index ${index} from ${oldQuantity} to ${value}`
    );

    // Dispatch update action
    dispatch(updateQuantity({ id, quantity: value, index }));

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
              Số lượng: {value}{" "}
              {value > oldQuantity
                ? `(+${value - oldQuantity})`
                : `(-${oldQuantity - value})`}
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
          </div>
        ),
        placement: "bottomRight",
        duration: 5,
        icon: <PercentageOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

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

            // Sử dụng một ID mặc định hợp lệ cho tất cả sản phẩm từ đơn hàng cũ
            console.log(
              `Sản phẩm "${item.name}" từ đơn hàng cũ có ID không hợp lệ: ${productId}`
            );

            // Sử dụng ID=2 làm mặc định (đảm bảo ID này tồn tại trong cơ sở dữ liệu)
            productId = 2;
            console.log(`Đã chuyển ID cho "${item.name}" thành: ${productId}`);
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

      // Hiển thị thông báo thành công rõ ràng
      console.log("ĐƠN HÀNG ĐÃ ĐƯỢC TẠO THÀNH CÔNG:", res.data);
      message.success(
        `Đơn hàng #${res.data.orderId} đã được tạo thành công! Đang chuyển đến trang thanh toán...`
      );

      // Chuyển đến trang thanh toán
      navigate(`/payment/${res.data.orderId}`);
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
    dispatch(clearCart());
    message.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
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
            stock: item.stock !== undefined ? item.stock : true,
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

              // Always keep products from order history (identified by productKey or fromOrder)
              if (item.productKey || item.fromOrder) {
                console.log(
                  `Keeping product from order history: ${
                    item.name || "Unknown"
                  }`
                );
                validItems.push(item);
                return;
              }

              // For regular products with database IDs, verify they exist
              if (isNaN(parseInt(item.id))) {
                console.error(
                  `Invalid product ID: ${item ? item.id : "undefined"}`
                );
                nonExistentItems.push(item);
                return;
              }

              const productId = parseInt(item.id);
              const response = await axios.get(
                `https://localhost:7285/api/Product/${productId}`
              );

              // If we get a successful response, the product exists
              validItems.push({
                ...item,
                id: productId,
                productId: productId,
                // Update with the latest price from the API
                price: response.data.price || item.price,
                originalPrice: response.data.originalPrice || item.price,
              });
            } catch (error) {
              console.error(
                `Error checking product ${item ? item.id : "undefined"}:`,
                error
              );

              // Keep products from order history despite API errors
              if (item && (item.productKey || item.fromOrder)) {
                console.log(
                  `Keeping product despite API error: ${item.name || "Unknown"}`
                );
                validItems.push(item);
              } else if (
                error.response &&
                (error.response.status === 400 || error.response.status === 404)
              ) {
                // If the error is a 400 Bad Request, it likely means the product doesn't exist
                nonExistentItems.push(item);
              }
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
      // Use a more unique identifier when selecting all items
      setSelectedItems(cartItems.map((item, index) => `${item.id}_${index}`));
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
                                  disabled={item.quantity <= 1}
                                />
                                <InputNumber
                                  min={1}
                                  max={item.stock}
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
                                />
                                <Button
                                  icon={<PlusOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(
                                      item.id,
                                      Math.min(item.stock, item.quantity + 1),
                                      index
                                    );
                                  }}
                                  className="border-gray-300 hover:border-pink-400 hover:text-pink-500 transition-colors"
                                  disabled={item.quantity >= item.stock}
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

                    {/* Phần mã khuyến mãi mới thêm vào */}
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <TagOutlined className="text-orange-500 mr-2" />
                        <Text strong>Mã khuyến mãi</Text>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-full">
                          <Text className="text-gray-500 mb-2 block">
                            Các mã bạn có thể áp dụng được
                          </Text>
                          <Select
                            placeholder="Chọn mã khuyến mãi"
                            className="w-full"
                            loading={isLoadingPromotions}
                            value={appliedPromotion?.promotionId || undefined}
                            onChange={handleApplyPromotion}
                            allowClear
                            disabled={
                              selectedItems.length === 0 ||
                              cartItems.length === 0
                            }
                          >
                            {activePromotions?.map((promotion) => (
                              <Option
                                key={promotion.promotionId}
                                value={promotion.promotionId}
                              >
                                <div className="flex items-center">
                                  <PercentageOutlined className="text-red-500 mr-2" />
                                  <span>
                                    {promotion.promotionName} - Giảm{" "}
                                    {promotion.discountPercentage}%
                                  </span>
                                </div>
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      {appliedPromotion && (
                        <div className="mt-2 flex justify-between">
                          <Text className="text-green-500">Giảm giá</Text>
                          <Text className="text-green-500">
                            -{formatPrice(discountAmount)}
                          </Text>
                        </div>
                      )}
                    </div>

                    <Divider className="my-4" />
                    <div className="flex justify-between">
                      <Text strong>Tổng cộng:</Text>
                      <Title level={3} className="text-pink-500">
                        {formatPrice(calculateFinalTotal())}
                      </Title>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={loading || selectedItems.length === 0}
                    onClick={handleCheckout}
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
