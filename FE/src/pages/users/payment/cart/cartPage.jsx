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

  const handleQuantityChange = (id, value) => {
    dispatch(updateQuantity({ id, quantity: value }));
    message.success("Số lượng đã được cập nhật");
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
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

    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateDiscount = () => {
    if (selectedItems.length === 0) return 0;

    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce(
        (total, item) =>
          total + (item.originalPrice - item.price) * item.quantity,
        0
      );
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

      // Kiểm tra và xử lý ID người dùng
      let userId = user.id;

      // Tính toán tổng giá trị đơn hàng
      const orderTotal = calculateTotal();

      // Tính toán giá cuối cùng sau khi áp dụng khuyến mãi
      const finalTotal = calculateFinalTotal();

      // Tạo đối tượng đơn hàng - chỉ bao gồm các sản phẩm đã chọn
      const order = {
        userId: userId,
        items: cartItems
          .filter((item) => selectedItems.includes(item.id))
          .map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        // Thêm thông tin khuyến mãi
        promotionId: appliedPromotion?.promotionId || null,
        promotionDiscount: discountAmount || 0,
        subtotal: orderTotal,
        total: finalTotal,
      };

      console.log("Sending order:", order);

      const res = await axios.post("https://localhost:7285/api/Order", order, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Store order information in sessionStorage for retrieval in payment page
      try {
        // Save the order information in sessionStorage including promotion details
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
        console.log("Order info saved to session storage:", orderInfo);
      } catch (sessionError) {
        console.error(
          "Error saving order info to session storage:",
          sessionError
        );
      }

      // Nếu đã sử dụng mã khuyến mãi, xóa mã khuyến mãi khỏi giỏ hàng
      if (appliedPromotion) {
        dispatch(removePromotion());
      }

      navigate(`/payment/${res.data.orderId}`);
    } catch (e) {
      console.log("Error creating order:", e);
      message.error("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!");
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
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  }, [cartItems.length]);

  // Handle select/deselect all
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
  const handleItemSelect = (id, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
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
                        cartItems.length > 0
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

                {cartItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-6 py-6">
                      <div className="flex items-center mr-2">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) =>
                            handleItemSelect(item.id, e.target.checked)
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
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
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
                                      Math.floor(Math.abs(value)) || 1
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
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      Math.min(item.stock, item.quantity + 1)
                                    )
                                  }
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
                                onClick={() => handleRemoveItem(item.id)}
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
                        <Select
                          placeholder="Chọn mã khuyến mãi"
                          className="w-full"
                          loading={isLoadingPromotions}
                          value={appliedPromotion?.promotionId || undefined}
                          onChange={handleApplyPromotion}
                          allowClear
                          disabled={
                            selectedItems.length === 0 || cartItems.length === 0
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
