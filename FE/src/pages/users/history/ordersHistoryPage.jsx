import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Spin,
  Alert,
  Empty,
  message,
  Input,
  Select,
  DatePicker,
  Tag,
  Badge,
  Tooltip,
  Button,
  Modal,
  Tabs,
  notification,
  Image,
} from "antd";
import {
  CheckCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  ShoppingOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  TagOutlined,
  HistoryOutlined,
  SettingOutlined,
  CarOutlined,
  GiftOutlined,
  FireOutlined,
  RightOutlined,
  DownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../../store/rootReducer";
import { useCancelOrderMutation } from "../../../services/api/beautyShopApi";
import {
  addToCart,
  updateQuantity,
} from "../../../store/slices/cart/cartSlice";

const { RangePicker } = DatePicker;

// Loại bỏ component FilterControls cũ và tích hợp trực tiếp vào trang

const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedProductDetails, setExpandedProductDetails] = useState({});
  const dispatch = useDispatch();

  // RTK Query hook for order cancellation
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  // Lấy userId từ localStorage
  const [userId, setUserId] = useState(() => {
    try {
      const authUserStr = localStorage.getItem("auth_user");

      if (authUserStr) {
        const authUser = JSON.parse(authUserStr);

        if (authUser && authUser.id) {
          return authUser.id;
        }
      }
      return null;
    } catch (error) {
      console.error("Error parsing auth_user:", error);
      return null;
    }
  });

  // API base URL
  const API_BASE_URL = "https://localhost:7285";

  // Thêm state để lưu trữ status updates
  const [orderStatusUpdates, setOrderStatusUpdates] = useState({});

  // Function to fetch product details for an order with empty products array
  const fetchOrderProducts = async (orderId) => {
    try {
      // Lấy thông tin đơn hàng
      const orderResponse = await axios.get(
        `${API_BASE_URL}/api/Order/${orderId}`,
        {
          headers: {
            accept: "*/*",
          },
        }
      );

      if (orderResponse.data && orderResponse.data.orderDetails) {
        // Lấy thông tin sản phẩm cho mỗi orderDetail
        const products = await Promise.all(
          orderResponse.data.orderDetails.map(async (item) => {
            try {
              const productResponse = await axios.get(
                `${API_BASE_URL}/api/Product/${item.productId}`,
                {
                  headers: {
                    accept: "*/*",
                  },
                }
              );

              const productId = item.productId;
              return {
                id: productId,
                productId: productId,
                productName: productResponse.data.productName || productResponse.data.name,
                price: parseFloat(item.price) || 0,
                quantity: parseInt(item.quantity) || 1,
                productImages: productResponse.data.imageUrls?.[0] || productResponse.data.image,
                brandName: productResponse.data.brandName || "Không có thông tin",
                category: productResponse.data.categoryName || "Không có thông tin",
                description: productResponse.data.description || "Không có mô tả chi tiết",
                specifications: productResponse.data.specifications || {},
              };
            } catch (error) {
              console.error(
                `Error fetching product details for product ${item.productId}:`,
                error
              );
              return {
                id: item.productId,
                productId: item.productId,
                productName: "Không thể tải thông tin sản phẩm",
                price: parseFloat(item.price) || 0,
                quantity: parseInt(item.quantity) || 1,
                productImages: null,
                brandName: "Không có thông tin",
                category: "Không có thông tin",
                description: "Không có mô tả chi tiết",
              };
            }
          })
        );

        return products;
      }

      return [];
    } catch (error) {
      console.error(
        `Error fetching product details for order ${orderId}:`,
        error
      );
      return [];
    }
  };

  // Function to retrieve detailed product information by ID
  const fetchProductById = async (productId) => {
    try {
      if (!productId) return null;

      // Ensure we have a valid numeric ID
      const numericProductId = parseInt(productId);
      if (isNaN(numericProductId)) {
        console.error(`Invalid product ID: ${productId}`);
        return null;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/Product/${numericProductId}`,
        {
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response.data) {
        // Ensure all ID and numeric fields are properly formatted
        const id = parseInt(response.data.id || response.data.productId);
        return {
          id: id,
          productId: id,
          productName: response.data.productName || response.data.name,
          price: parseFloat(response.data.price) || 0,
          productImages:
            response.data.imageUrls?.[0] || response.data.productImage,
          description: response.data.description || "",
          brandName: response.data.brandName || "",
          category: response.data.categoryName || "",
          specifications: response.data.specifications || {},
          origin: response.data.origin || "",
          sku: response.data.sku || "",
        };
      }

      return null;
    } catch (error) {
      console.error(
        `Error fetching product details for ID ${productId}:`,
        error
      );
      return null;
    }
  };

  // RTK Query hook for order cancellation
  useEffect(() => {
    fetchOrders();

    // Lấy status updates từ localStorage khi component mount
    const updates = JSON.parse(
      localStorage.getItem("orderStatusUpdates") || "{}"
    );
    console.log("Status updates from localStorage:", updates); // Debug log
    setOrderStatusUpdates(updates);

    // Kiểm tra cập nhật mỗi giây
    const interval = setInterval(() => {
      const latestUpdates = JSON.parse(
        localStorage.getItem("orderStatusUpdates") || "{}"
      );
      setOrderStatusUpdates(latestUpdates);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Effect to try to retrieve cart details for "unpaid" orders
  useEffect(() => {
    // Check if we have any unpaid orders without products
    const unpaidOrdersWithoutProducts = orders.filter(
      (order) =>
        order.status === "unpaid" &&
        (!order.products || order.products.length === 0)
    );

    if (unpaidOrdersWithoutProducts.length > 0) {
      // Try to get cart details from localStorage
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        if (cart.length > 0) {
          // Update orders with cart products for unpaid orders
          setOrders((prevOrders) =>
            prevOrders.map((order) => {
              if (
                order.status === "unpaid" &&
                (!order.products || order.products.length === 0)
              ) {
                return {
                  ...order,
                  products: cart,
                  total: cart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  ),
                };
              }
              return order;
            })
          );
        }
      } catch (error) {
        console.error("Error retrieving cart for unpaid orders:", error);
      }
    }
  }, [orders]);

  const fetchOrders = async () => {
    // Kiểm tra userId có tồn tại không
    if (!userId) {
      setError("Vui lòng đăng nhập để xem lịch sử đơn hàng");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching orders for user ID: ${userId}`);

      // Sử dụng endpoint mới như hiển thị trong hình
      const response = await axios.get(
        `${API_BASE_URL}/api/History/orders/user/${userId}`,
        {
          headers: {
            accept: "*/*",
          },
        }
      );

      console.log("API response:", response.data);

      // Khôi phục trạng thái từ localStorage
      const orderStatusUpdates = JSON.parse(
        localStorage.getItem("orderStatusUpdates") || "{}"
      );

      // Process the response based on the API structure
      if (response.data && Array.isArray(response.data)) {
        // Include all orders instead of filtering by historyStatus
        const formattedOrders = response.data.map((order) => {
          // Tính tổng tiền từ các sản phẩm
          let totalAmount = 0;
          if (order.products && Array.isArray(order.products)) {
            totalAmount = order.products.reduce((sum, product) => {
              return sum + (product.price || 0) * (product.quantity || 1);
            }, 0);
          }

          // Chuyển đổi trạng thái từ API sang trạng thái trong ứng dụng
          let status = (order.orderStatus || "").toLowerCase();

          // Kiểm tra xem status có phải là "PAID" không
          const isPaid =
            status === "paid" ||
            order.status === "PAID" ||
            (order.paymentStatus &&
              order.paymentStatus.toUpperCase() === "PAID") ||
            order.historyStatus === "COMPLETED";

          // Kiểm tra nếu có cập nhật trạng thái từ staff trong localStorage
          const hasStatusUpdate =
            orderStatusUpdates[order.orderId] ||
            (order.trackingCode && orderStatusUpdates[order.trackingCode]);

          // Ưu tiên sử dụng trạng thái từ localStorage (nếu có)
          if (hasStatusUpdate) {
            status =
              orderStatusUpdates[order.orderId] ||
              orderStatusUpdates[order.trackingCode];
          } else {
            // Nếu không có trong localStorage, xử lý trạng thái từ API
            // Đảm bảo trạng thái khớp với các giá trị trong dropdown
            switch (status) {
              case "completed":
              case "complete":
                status = "completed";
                break;
              case "shipping":
              case "delivering":
                status = "shipping";
                break;
              case "pending":
                status = "pending";
                break;
              case "cancelled":
              case "failed":
                status = "cancelled";
                break;
              case "delivered":
              case "complete":
                status = "delivered";
                break;
              default:
                // Nếu đã thanh toán và không có trạng thái cụ thể, hiển thị là completed
                if (isPaid) {
                  // Only set as completed if actually delivered
                  if (
                    order.orderStatus &&
                    order.orderStatus.toLowerCase() === "delivered"
                  ) {
                    status = "completed";
                  } else {
                    // If paid but not delivered yet, keep the actual status
                    status = "pending"; // Default to pending if status is unknown
                  }
                } else {
                  status = "unpaid"; // Changed from "pending" to "unpaid" for unpaid orders
                }
            }
          }

          return {
            id: order.orderId || order.id || "N/A",
            orderId: order.orderId || order.id || "N/A",
            trackingCode: order.trackingCode || "N/A",
            shipper: order.shipper || "Chưa xác định",
            status: status,
            date: order.orderDate || new Date().toISOString(),
            total: order.totalAmount || totalAmount,
            products: order.products || [],
            estimatedDelivery: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            isPaid: isPaid,
          };
        });

        setOrders(formattedOrders);
      } else {
        setOrders([]);
        message.info("Không tìm thấy đơn hàng nào");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        err.response?.data?.message ||
          "Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau."
      );
      message.error("Không thể tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (value) => {
    setFilterStatus(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "shipping":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "unpaid":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusGlow = (status) => {
    switch (status) {
      case "completed":
        return "shadow-green-300";
      case "shipping":
        return "shadow-blue-300";
      case "pending":
        return "shadow-yellow-300";
      case "cancelled":
        return "shadow-red-300";
      case "unpaid":
        return "shadow-orange-300";
      default:
        return "shadow-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleOutlined className="text-green-500" />;
      case "shipping":
        return <LoadingOutlined className="text-blue-500" />;
      case "pending":
        return <ClockCircleOutlined className="text-yellow-500" />;
      case "cancelled":
        return <CloseCircleOutlined className="text-red-500" />;
      case "unpaid":
        return <ExclamationCircleOutlined className="text-orange-500" />;
      default:
        return <InfoCircleOutlined className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Đã giao hàng";
      case "pending":
        return "Chờ xác nhận";
      case "shipping":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      case "unpaid":
        return "Chưa thanh toán";
      default:
        return "Không xác định";
    }
  };

  // New function to get payment status text
  const getPaymentStatusText = (isPaid) => {
    return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
  };

  // New function to get payment status color
  const getPaymentStatusColor = (isPaid) => {
    return isPaid ? "bg-green-500" : "bg-orange-500";
  };

  // New function to get payment status glow
  const getPaymentStatusGlow = (isPaid) => {
    return isPaid ? "shadow-green-300" : "shadow-orange-300";
  };

  const getStatusIconComponent = (status, className = "") => {
    switch (status) {
      case "completed":
        return (
          <div className={`rounded-full bg-green-100 p-2 ${className}`}>
            <CheckCircleOutlined className="text-green-500 text-lg" />
          </div>
        );
      case "shipping":
        return (
          <div className={`rounded-full bg-blue-100 p-2 ${className}`}>
            <CarOutlined className="text-blue-500 text-lg" />
          </div>
        );
      case "pending":
        return (
          <div className={`rounded-full bg-yellow-100 p-2 ${className}`}>
            <ClockCircleOutlined className="text-yellow-500 text-lg" />
          </div>
        );
      case "cancelled":
        return (
          <div className={`rounded-full bg-red-100 p-2 ${className}`}>
            <CloseCircleOutlined className="text-red-500 text-lg" />
          </div>
        );
      case "unpaid":
        return (
          <div className={`rounded-full bg-orange-100 p-2 ${className}`}>
            <ExclamationCircleOutlined className="text-orange-500 text-lg" />
          </div>
        );
      default:
        return (
          <div className={`rounded-full bg-gray-100 p-2 ${className}`}>
            <InfoCircleOutlined className="text-gray-500 text-lg" />
          </div>
        );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTimeRemaining = (deliveryDate) => {
    const now = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Đã quá hạn";
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Ngày mai";
    return `${diffDays} ngày`;
  };

  // Filter orders based on search term and other filters
  const filteredOrders = orders.filter((order) => {
    // Filter by tab/status
    if (activeTab !== "all" && order.status !== activeTab) {
      return false;
    }

    // Filter by dropdown status
    if (filterStatus !== "all" && order.status !== filterStatus) {
      return false;
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const orderDate = new Date(order.date);
      const startDate = dateRange[0].startOf("day").toDate();
      const endDate = dateRange[1].endOf("day").toDate();

      if (orderDate < startDate || orderDate > endDate) {
        return false;
      }
    }

    // If no search term, return all filtered orders
    if (!searchTerm) return true;

    // Search by order ID or tracking code
    if (
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.trackingCode
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
      return true;
    }

    // Search by product name
    if (order.products && Array.isArray(order.products)) {
      return order.products.some(
        (product) =>
          product.productName &&
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return false;
  });

  // Stats for order summary
  const orderStats = {
    total: orders.length,
    completed: orders.filter((o) => o.status === "completed").length,
    shipping: orders.filter((o) => o.status === "shipping").length,
    pending: orders.filter((o) => o.status === "pending").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    unpaid: orders.filter((o) => o.status === "unpaid").length,
  };

  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);

      // Find the order
      const order = orders.find((o) => o.id === orderId);

      // Log the order for debugging
      console.log(
        `Expanding order ${orderId}:`,
        JSON.stringify(order, null, 2)
      );

      // If the order has no products or empty products array, fetch them
      if (order && (!order.products || order.products.length === 0)) {
        // Set loading state for this order
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, productsLoading: true } : o
          )
        );

        // Fetch products and update the order
        fetchOrderProducts(orderId).then((products) => {
          console.log(
            `Fetched products for order ${orderId}:`,
            JSON.stringify(products, null, 2)
          );

          // Ensure each product has required fields
          const processedProducts = products.map((product) => {
            // For each product, ensure it has valid fields or provide defaults
            return {
              ...product,
              id: product.id || product.productId || Date.now(),
              productId: product.productId || product.id || Date.now(),
              productName: product.productName || "Sản phẩm không rõ tên",
              price: parseFloat(product.price) || 0,
              quantity: parseInt(product.quantity) || 1,
              productImages: product.productImages || product.image || "",
              brandName: product.brandName || product.brand || "",
              category: product.category || "",
              description: product.description || "",
            };
          });

          setOrders((prevOrders) =>
            prevOrders.map((o) =>
              o.id === orderId
                ? {
                    ...o,
                    products: processedProducts,
                    productsLoading: false,
                  }
                : o
            )
          );
        });
      } else if (order && order.products && order.products.length > 0) {
        // If we already have products, ensure they all have the required fields
        const processedProducts = order.products.map((product) => {
          return {
            ...product,
            id: product.id || product.productId || Date.now(),
            productId: product.productId || product.id || Date.now(),
            productName: product.productName || "Sản phẩm không rõ tên",
            price: parseFloat(product.price) || 0,
            quantity: parseInt(product.quantity) || 1,
            productImages: product.productImages || product.image || "",
            brandName: product.brandName || product.brand || "",
            category: product.category || "",
            description: product.description || "",
          };
        });

        if (
          JSON.stringify(order.products) !== JSON.stringify(processedProducts)
        ) {
          console.log(
            "Updating products with processed versions:",
            processedProducts
          );
          setOrders((prevOrders) =>
            prevOrders.map((o) =>
              o.id === orderId ? { ...o, products: processedProducts } : o
            )
          );
        }
      }
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      // Confirm with user
      Modal.confirm({
        title: "Hủy đơn hàng",
        content: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
        okText: "Hủy đơn hàng",
        okType: "danger",
        cancelText: "Không",
        async onOk() {
          try {
            await cancelOrder(orderId).unwrap();
            message.success("Đơn hàng đã được hủy thành công");

            // Update local state
            setOrders(
              orders.map((order) =>
                order.id === orderId ? { ...order, status: "cancelled" } : order
              )
            );

            // Also update in localStorage to maintain consistency with staff view
            const orderStatusUpdates = JSON.parse(
              localStorage.getItem("orderStatusUpdates") || "{}"
            );
            orderStatusUpdates[orderId] = "cancelled";
            localStorage.setItem(
              "orderStatusUpdates",
              JSON.stringify(orderStatusUpdates)
            );

            // Reload orders
            fetchOrders();
          } catch (error) {
            message.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
          }
        },
      });
    } catch (error) {
      message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  // Navigate to product detail page
  const navigateToProductDetail = (product) => {
    if (product && (product.id || product.productId)) {
      const productId = product.id || product.productId;

      // Show loading message
      message.loading({
        content: "Đang chuẩn bị thông tin sản phẩm...",
        key: "productNavigation",
      });

      // Try to fetch fresh product data to ensure we have the latest info
      fetchProductById(productId)
        .then((fullProduct) => {
          message.success({
            content: "Đã tìm thấy thông tin sản phẩm!",
            key: "productNavigation",
            duration: 1,
          });

          // Navigate to product page
          navigate(`/product/${productId}`);
        })
        .catch((error) => {
          // If fetching fails, still navigate but with a warning
          message.warning({
            content: "Đang chuyển hướng với thông tin có sẵn",
            key: "productNavigation",
            duration: 1,
          });
          navigate(`/product/${productId}`);
        });
    } else {
      message.error("Không thể xem chi tiết sản phẩm");
    }
  };

  // Add single product to cart
  const handleAddToCart = async (product) => {
    try {
      // Log the original product object
      console.log("Adding to cart product:", JSON.stringify(product, null, 2));

      if (!product) {
        message.warning("Sản phẩm không hợp lệ");
        return;
      }

      // Get current cart to check for existing products
      const currentCart = store.getState().cart.items || [];

      // Extract essential product info
      const name = product.productName || product.name || "Sản phẩm không xác định";
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 1;

      // Create a product key based on name and price
      const productKey = `${name}_${price}`;

      // Check if this product already exists in the cart by matching name and price
      const existingProduct = currentCart.find(
        (item) => item.name === name && parseFloat(item.price) === price
      );

      if (existingProduct) {
        // If product exists, update its quantity
        console.log(`Product already in cart, updating quantity: ${name}`);
        dispatch(
          updateQuantity({
            id: existingProduct.id,
            quantity: existingProduct.quantity + quantity,
          })
        );

        // Show success message with enhanced UI
        notification.success({
          message: "Đã cập nhật số lượng trong giỏ hàng",
          description: (
            <div className="flex items-start">
              <div className="mr-3">
                <Image
                  src={existingProduct.image}
                  alt={name}
                  width={50}
                  preview={false}
                  className="rounded-md"
                />
              </div>
              <div>
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Số lượng: {existingProduct.quantity + quantity} (
                  {quantity > 1 ? `+${quantity}` : "+1"})
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => navigate("/cart")}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    Xem giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          ),
          icon: <ShoppingCartOutlined className="text-green-500" />,
          placement: "bottomRight",
          duration: 3,
        });
      } else {
        // Create a new cart item
        const originalId = product.id || product.productId || null;
        const tempId = Date.now();

        // Tạo một đối tượng sản phẩm mới hoàn toàn, không liên kết với đơn hàng cũ
        const cartItem = {
          id: originalId || tempId,
          productId: originalId || tempId,
          name: name,
          productName: name,
          price: price,
          quantity: quantity,
          image: product.productImages || product.image || "",
          productImages: product.productImages || product.image || "",
          brand: product.brandName || product.brand || "",
          brandName: product.brandName || product.brand || "",
          category: product.category || "",
          stock: true,
          discount: parseInt(product.discount) || 0,
          description: product.description || "",
          originalPrice: parseFloat(product.originalPrice) || parseFloat(product.price) || 0,
          // Không thêm fromOrder để tạo đơn hàng mới hoàn toàn
          productKey: productKey,
        };

        // Add the product to cart
        console.log(`Adding new product to cart: ${name}`);
        dispatch(addToCart(cartItem));

        // Show success message with enhanced UI
        notification.success({
          message: "Đã thêm vào giỏ hàng",
          description: (
            <div className="flex items-start">
              <div className="mr-3">
                <Image
                  src={cartItem.image}
                  alt={cartItem.name}
                  width={50}
                  preview={false}
                  className="rounded-md"
                />
              </div>
              <div>
                <div className="font-medium">{cartItem.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatPrice(cartItem.price)}
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => navigate("/cart")}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    Xem giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          ),
          icon: <ShoppingCartOutlined className="text-green-500" />,
          placement: "bottomRight",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      message.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  // Add all products from an order to cart
  const buyAllAgain = (order) => {
    try {
      // Validate order has products
      if (!order.products || order.products.length === 0) {
        message.warning("Không có sản phẩm nào để mua lại");
        return;
      }

      console.log("Order products:", JSON.stringify(order.products, null, 2));

      // Get current cart items to check for existing products
      const currentCart = store.getState().cart.items || [];
      console.log("Current cart before adding:", currentCart);

      let addedProducts = 0;
      const productMap = {}; // To track products we're adding in this operation

      // First, process all products to be added
      order.products.forEach((product, index) => {
        // Skip invalid products
        if (!product) {
          console.warn("Skipping undefined product");
          return;
        }

        // Extract essential product info
        const name =
          product.productName || product.name || "Sản phẩm không xác định";
        const price = parseFloat(product.price) || 0;
        const quantity = parseInt(product.quantity) || 1;

        // Create a product key based on name and price to identify similar products
        // This key helps us group identical products
        const productKey = `${name}_${price}`;

        if (productMap[productKey]) {
          // If we've already processed this product in this order, just increase quantity
          productMap[productKey].quantity += quantity;
        } else {
          // Otherwise create a new entry with a consistent ID
          const originalId = product.id || product.productId || null;
          const tempId = Date.now() + index;

          productMap[productKey] = {
            id: originalId || tempId,
            productId: originalId || tempId,
            name: name,
            productName: name,
            price: price,
            quantity: quantity,
            image: product.productImages || product.image || "",
            productImages: product.productImages || product.image || "",
            brand: product.brandName || product.brand || "",
            brandName: product.brandName || product.brand || "",
            category: product.category || "",
            stock: true,
            discount: parseInt(product.discount) || 0,
            description: product.description || "",
            originalPrice:
              parseFloat(product.originalPrice) ||
              parseFloat(product.price) ||
              0,
            // Add metadata to identify this product
            fromOrder: order.id || order.orderId,
            productKey: productKey,
          };
        }
      });

      // Now process each product against the existing cart
      Object.values(productMap).forEach((newProduct) => {
        // Use a more precise matching strategy with name and other properties
        const existingProduct = currentCart.find(
          (item) =>
            // Match by name and price - both must match exactly
            item.name === newProduct.name &&
            parseFloat(item.price) === parseFloat(newProduct.price) &&
            // Also match by product key if available, or check if both are the same product type
            ((item.productKey && item.productKey === newProduct.productKey) ||
              (item.id === newProduct.id && item.brand === newProduct.brand))
        );

        console.log(
          `Looking for product in cart: ${newProduct.name} with price ${newProduct.price}`
        );
        if (existingProduct) {
          console.log(
            `Found existing product: ${existingProduct.name} with price ${existingProduct.price} and ID ${existingProduct.id}`
          );
        } else {
          console.log(`No existing product found, adding as new`);
        }

        // Find the exact index of the existing product in the cart if it exists
        const existingIndex = existingProduct
          ? currentCart.findIndex(
              (item) =>
                item.name === newProduct.name &&
                parseFloat(item.price) === parseFloat(newProduct.price) &&
                ((item.productKey &&
                  item.productKey === newProduct.productKey) ||
                  (item.id === newProduct.id &&
                    item.brand === newProduct.brand))
            )
          : -1;

        if (existingProduct && existingIndex >= 0) {
          // If exact product exists, update its quantity
          console.log(
            `Product already in cart, updating quantity: ${newProduct.name} at index ${existingIndex}`
          );
          console.log(
            `Current quantity: ${existingProduct.quantity}, Adding: ${newProduct.quantity}`
          );

          dispatch(
            updateQuantity({
              id: existingProduct.id,
              quantity: existingProduct.quantity + newProduct.quantity,
              index: existingIndex, // Pass the correct index for the item
            })
          );
        } else {
          // If product doesn't exist or has different characteristics, add it as new
          console.log(`Adding new product to cart: ${newProduct.name}`);
          // Add a unique timestamp to ensure each new item is distinct
          const uniqueNewProduct = {
            ...newProduct,
            addedAt: Date.now() + Math.floor(Math.random() * 1000),
          };
          dispatch(addToCart(uniqueNewProduct));
        }

        addedProducts++;
      });

      // Only show success message if products were added
      if (addedProducts > 0) {
        // Count how many products were updated vs newly added
        const updatedProducts = Object.keys(productMap).filter((key) => {
          const product = productMap[key];
          return currentCart.some(
            (item) =>
              item.name === product.name &&
              parseFloat(item.price) === parseFloat(product.price)
          );
        }).length;

        const newlyAddedProducts = addedProducts - updatedProducts;

        // Show success message with enhanced UI
        notification.success({
          message: "Đã cập nhật giỏ hàng",
          description: (
            <div>
              <div className="font-medium">
                {updatedProducts > 0 && (
                  <p>{updatedProducts} sản phẩm đã được cập nhật số lượng</p>
                )}
                {newlyAddedProducts > 0 && (
                  <p>
                    {newlyAddedProducts} sản phẩm mới đã được thêm vào giỏ hàng
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Đơn hàng #{order.id || order.orderId}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => navigate("/cart")}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Xem giỏ hàng
                </button>
              </div>
            </div>
          ),
          icon: <ShoppingCartOutlined className="text-green-500" />,
          placement: "bottomRight",
          duration: 3,
        });
      } else {
        message.warning("Không thể thêm sản phẩm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Error adding all products to cart:", error);
      message.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  // Toggle product details expansion
  const toggleProductDetails = (productId) => {
    setExpandedProductDetails((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header section with animated background */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="relative mb-10 overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

          <div className="relative p-8 md:p-10 z-10">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Lịch Sử Đơn Hàng
            </h1>
          </div>
        </motion.div>

        {/* Advanced Search & Filter Section */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-8 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
        >
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tìm kiếm đơn hàng
                </label>
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Nhập mã đơn hoặc tên sản phẩm..."
                  className="h-12 rounded-xl border-2 hover:border-purple-300 focus:border-purple-500
                    transition-all duration-300 shadow-sm hover:shadow-md"
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                />
              </div>

              <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <Select
                  defaultValue="all"
                  className="w-full h-12 rounded-xl border-2 hover:border-purple-300 focus:border-purple-500
                    transition-all duration-300 shadow-sm hover:shadow-md"
                  onChange={handleStatusChange}
                  options={[
                    {
                      value: "all",
                      label: (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-3 h-3 rounded-full bg-gray-400" />
                          <span className="font-medium">Tất cả</span>
                        </div>
                      ),
                    },
                    {
                      value: "completed",
                      label: (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                          <span className="font-medium">Đã thanh toán</span>
                        </div>
                      ),
                    },
                    {
                      value: "shipping",
                      label: (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                          <span className="font-medium">Đang giao hàng</span>
                        </div>
                      ),
                    },
                    {
                      value: "pending",
                      label: (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span className="font-medium">Chờ xác nhận</span>
                        </div>
                      ),
                    },
                    {
                      value: "unpaid",
                      label: (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-3 h-3 rounded-full bg-orange-500" />
                          <span className="font-medium">Chưa thanh toán</span>
                        </div>
                      ),
                    },
                  ]}
                  dropdownStyle={{
                    borderRadius: "1rem",
                    padding: "0.5rem",
                    border: "2px solid #e5e7eb",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian
                </label>
                <RangePicker
                  className="h-12 rounded-xl border-2 hover:border-purple-300 focus:border-purple-500
                    transition-all duration-300 shadow-sm hover:shadow-md"
                  format="DD/MM/YYYY"
                  onChange={setDateRange}
                  placeholder={["Từ ngày", "Đến ngày"]}
                />
              </div>

              <Button
                onClick={fetchOrders}
                className="h-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl
                  hover:shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-purple-700
                  hover:translate-y-[-2px] border-0"
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </motion.div>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            className="mb-6 rounded-xl shadow-md"
            icon={<ExclamationCircleOutlined />}
            action={
              <button
                onClick={fetchOrders}
                className="px-4 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                Thử lại
              </button>
            }
          />
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
            <Spin
              size="large"
              indicator={
                <LoadingOutlined className="text-4xl text-pink-500" spin />
              }
            />
            <p className="mt-4 text-gray-600 animate-pulse">
              Đang tải dữ liệu đơn hàng...
            </p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0 }}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-lg 
                    border border-gray-100 hover:border-purple-200 
                    transition-all duration-300 overflow-hidden
                    ${order.status === "cancelled" ? "opacity-90" : ""}`}
                >
                  {/* Order Header */}
                  <div className="p-6 pb-3">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        {getStatusIconComponent(order.status, "md:hidden")}
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                              <span className="text-purple-500 mr-1">#</span>
                              <span>{order.id}</span>
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                            <CalendarOutlined />
                            <span>{formatDate(order.date)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {getStatusIconComponent(order.status, "hidden md:flex")}

                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-3">
                            {/* Show main status badge only if there's no status update or if the update is different */}
                            {!orderStatusUpdates[order.trackingCode] ||
                            orderStatusUpdates[order.trackingCode] !==
                              order.status ? (
                              <span
                                className={`px-3 py-1 rounded-full text-white ${getStatusColor(
                                  order.status
                                )} shadow-sm ${getStatusGlow(order.status)}`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            ) : null}

                            {/* Payment status badge */}
                            <span
                              className={`px-3 py-1 rounded-full text-white ${getPaymentStatusColor(
                                order.isPaid
                              )} shadow-sm ${getPaymentStatusGlow(
                                order.isPaid
                              )}`}
                            >
                              {getPaymentStatusText(order.isPaid)}
                            </span>

                            {/* Tag trạng thái mới từ staff/admin */}
                            {orderStatusUpdates[order.trackingCode] && (
                              <span
                                className={`px-3 py-1 rounded-full text-white flex items-center gap-2
                                  ${
                                    orderStatusUpdates[order.trackingCode] ===
                                    "shipping"
                                      ? "bg-blue-500 shadow-sm shadow-blue-300"
                                      : orderStatusUpdates[
                                          order.trackingCode
                                        ] === "delivered"
                                      ? "bg-green-500 shadow-sm shadow-green-300"
                                      : orderStatusUpdates[
                                          order.trackingCode
                                        ] === "pending"
                                      ? "bg-yellow-500 shadow-sm shadow-yellow-300"
                                      : orderStatusUpdates[
                                          order.trackingCode
                                        ] === "cancelled"
                                      ? "bg-red-500 shadow-sm shadow-red-300"
                                      : "bg-gray-500"
                                  }`}
                              >
                                {orderStatusUpdates[order.trackingCode] ===
                                "shipping" ? (
                                  <>
                                    <span>Đang giao hàng</span>
                                  </>
                                ) : orderStatusUpdates[order.trackingCode] ===
                                  "delivered" ? (
                                  <>
                                    <CheckCircleOutlined />
                                    <span>Đã giao hàng</span>
                                  </>
                                ) : orderStatusUpdates[order.trackingCode] ===
                                  "pending" ? (
                                  <>
                                    <ClockCircleOutlined />
                                    <span>Chờ xác nhận</span>
                                  </>
                                ) : orderStatusUpdates[order.trackingCode] ===
                                  "cancelled" ? (
                                  <>
                                    <CloseCircleOutlined />
                                    <span>Đã hủy</span>
                                  </>
                                ) : (
                                  <span>
                                    {orderStatusUpdates[order.trackingCode]}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Tracking Info */}
                  <div className="px-6 py-2 border-t border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-wrap items-center justify-between gap-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Tooltip title="Mã theo dõi">
                          <TagOutlined className="mr-2 text-purple-500" />
                        </Tooltip>
                        <span className="font-medium mr-1">Mã theo dõi:</span>
                        <span className="text-blue-600 font-semibold">
                          {order.trackingCode}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Tooltip title="Đơn vị vận chuyển">
                          <TeamOutlined className="mr-2 text-green-500" />
                        </Tooltip>
                        <span className="font-medium mr-1">
                          Người giao hàng:
                        </span>
                        <span>{order.shipper}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Tooltip title="Tổng tiền">
                          <FireOutlined className="mr-2 text-red-500" />
                        </Tooltip>
                        <span className="font-medium mr-1">Tổng tiền:</span>
                        <span className="text-red-600 font-bold">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      {/* Cancel Order Button - Only show for pending or shipping orders that have been paid */}
                      {(order.status === "pending" ||
                        order.status === "shipping") &&
                        order.status !== "unpaid" && (
                          <Button
                            danger
                            type="text"
                            icon={<CloseCircleOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelOrder(order.id);
                            }}
                            loading={isCancelling}
                            className="text-sm"
                          >
                            Hủy đơn
                          </Button>
                        )}

                      <button
                        onClick={() => toggleOrderExpand(order.id)}
                        className="text-sm text-purple-600 font-medium flex items-center gap-1
                          hover:text-purple-800 transition-colors px-3 py-1.5 rounded-lg
                          hover:bg-purple-50"
                      >
                        {expandedOrder === order.id ? (
                          <>
                            Thu gọn <DownOutlined />
                          </>
                        ) : (
                          <>
                            Chi tiết <RightOutlined />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ opacity: 1, height: "auto" }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-6">
                        <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                          <ShoppingOutlined className="text-purple-500" />
                          Chi tiết đơn hàng
                        </h4>

                        <div className="space-y-4">
                          {order.productsLoading ? (
                            <div className="flex justify-center py-8">
                              <Spin
                                indicator={
                                  <LoadingOutlined
                                    style={{ fontSize: 24 }}
                                    spin
                                  />
                                }
                                tip="Đang tải thông tin sản phẩm..."
                              />
                            </div>
                          ) : order.products && order.products.length > 0 ? (
                            order.products.map((product, index) => (
                              <div
                                key={index}
                                className="flex flex-col md:flex-row justify-between p-4 border border-gray-100 rounded-xl
                                  hover:border-purple-200 transition-all hover:bg-gray-50"
                              >
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                                  <div className="relative">
                                    {product.productImages ? (
                                      <img
                                        src={product.productImages}
                                        alt={product.productName}
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                      />
                                    ) : (
                                      <div className="w-24 h-24 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <ShoppingOutlined className="text-3xl text-purple-400" />
                                      </div>
                                    )}
                                    {product.quantity > 1 && (
                                      <div className="absolute -top-2 -right-2 bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                        {product.quantity}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h5
                                      className="font-medium text-lg text-gray-800 hover:text-purple-600 transition-colors cursor-pointer"
                                      onClick={() =>
                                        navigateToProductDetail(product)
                                      }
                                    >
                                      {product.productName ||
                                        `Sản phẩm #${index + 1}`}
                                    </h5>
                                    <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-2">
                                      {product.brandName && (
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                                          {product.brandName}
                                        </span>
                                      )}
                                      {product.category && (
                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs">
                                          {product.category}
                                        </span>
                                      )}
                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        Số lượng: {product.quantity || 1}
                                      </span>
                                    </div>
                                    {product.description && (
                                      <p className="text-sm text-gray-600 mt-2">
                                        {product.description.length > 120
                                          ? product.description.substring(
                                              0,
                                              120
                                            ) + "..."
                                          : product.description}
                                      </p>
                                    )}
                                    <div className="mt-3">
                                      <Button
                                        type="link"
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleProductDetails(
                                            product.id ||
                                              product.productId ||
                                              index
                                          );
                                        }}
                                        className="px-0 text-purple-600 hover:text-purple-700"
                                      >
                                        {expandedProductDetails[
                                          product.id ||
                                            product.productId ||
                                            index
                                        ]
                                          ? "Ẩn chi tiết"
                                          : "Xem thêm chi tiết"}
                                      </Button>
                                    </div>

                                    {/* Expanded product details */}
                                    {expandedProductDetails[
                                      product.id || product.productId || index
                                    ] && (
                                      <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100 text-sm">
                                        <h6 className="font-medium mb-2 text-purple-700">
                                          Thông tin chi tiết
                                        </h6>
                                        <ul className="space-y-2">
                                          {product.specifications &&
                                            Object.entries(
                                              product.specifications
                                            ).map(([key, value], i) => (
                                              <li
                                                key={i}
                                                className="flex justify-between"
                                              >
                                                <span className="text-gray-600">
                                                  {key}:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                  {value}
                                                </span>
                                              </li>
                                            ))}
                                          {product.origin && (
                                            <li className="flex justify-between">
                                              <span className="text-gray-600">
                                                Xuất xứ:
                                              </span>
                                              <span className="font-medium text-gray-800">
                                                {product.origin}
                                              </span>
                                            </li>
                                          )}
                                          {product.sku && (
                                            <li className="flex justify-between">
                                              <span className="text-gray-600">
                                                Mã sản phẩm:
                                              </span>
                                              <span className="font-medium text-gray-800">
                                                {product.sku}
                                              </span>
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col justify-between items-end mt-4 md:mt-0">
                                  <div className="text-right">
                                    <div className="font-bold text-gray-800 text-lg">
                                      {formatPrice(product.price || 0)}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      {formatPrice(
                                        (product.price || 0) *
                                          (product.quantity || 1)
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddToCart(product);
                                    }}
                                    className="mt-4 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                                  >
                                    <ShoppingOutlined className="mr-2" />
                                    Mua lại
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-6 text-center text-gray-500 italic bg-gray-50 rounded-xl">
                              <ShoppingOutlined className="text-2xl mb-2 text-gray-400" />
                              <p>Không có thông tin chi tiết sản phẩm</p>
                              <Button
                                type="primary"
                                className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0"
                                onClick={() => {
                                  // Set loading state for this order
                                  setOrders((prevOrders) =>
                                    prevOrders.map((o) =>
                                      o.id === order.id
                                        ? { ...o, productsLoading: true }
                                        : o
                                    )
                                  );

                                  // Fetch products and update the order
                                  fetchOrderProducts(order.id).then(
                                    (products) => {
                                      setOrders((prevOrders) =>
                                        prevOrders.map((o) =>
                                          o.id === order.id
                                            ? {
                                                ...o,
                                                products,
                                                productsLoading: false,
                                              }
                                            : o
                                        )
                                      );
                                    }
                                  );
                                }}
                              >
                                Lấy thông tin sản phẩm
                              </Button>
                            </div>
                          )}

                          {/* Order Summary Section */}
                          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <h4 className="font-medium text-gray-700 mb-4">
                              Tóm tắt đơn hàng
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-gray-600">
                                <span>Tổng tiền sản phẩm:</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                              <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
                                <span>Tổng thanh toán:</span>
                                <span className="text-xl text-pink-600">
                                  {formatPrice(order.total)}
                                </span>
                              </div>
                              {/* Only show "Mua lại tất cả" button when there are more than 1 products */}
                              {order.products && order.products.length > 1 && (
                                <div className="mt-4 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      buyAllAgain(order);
                                    }}
                                    className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 py-2 px-4 text-white font-semibold"
                                  >
                                    Mua lại tất cả
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order Timeline */}
                          <div className="mt-6">
                            <div className="relative pl-6 ml-2 space-y-6 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[2px] before:bg-gray-200">
                              {/* Unpaid Status - show for unpaid orders */}
                              {order.status === "unpaid" && (
                                <div className="relative flex items-center gap-4">
                                  <div className="absolute left-[-22px] w-5 h-5 rounded-full bg-orange-500 border-4 border-orange-100"></div>
                                  <div className="flex-1 bg-orange-50 p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-orange-700">
                                        Chưa thanh toán
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(order.date)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Đơn hàng của bạn đang chờ thanh toán
                                    </p>
                                    {order.products &&
                                      order.products.length > 0 && (
                                        <div className="mt-3 bg-white p-2 rounded-lg border border-orange-100">
                                          <p className="text-sm text-gray-700 mb-2">
                                            <InfoCircleOutlined className="text-blue-500 mr-2" />
                                            Bạn có thể tiếp tục thanh toán hoặc
                                            {order.products.length > 1
                                              ? " mua lại các sản phẩm"
                                              : " mua lại sản phẩm"}
                                            trong đơn hàng này.
                                          </p>
                                          <div className="flex gap-2">
                                            <Button
                                              type="primary"
                                              size="small"
                                              onClick={() =>
                                                navigate(`/payment/${order.id}`)
                                              }
                                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0"
                                            >
                                              Tiếp tục thanh toán
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )}

                              {/* Shipping Status - show only if relevant */}
                              {(order.status === "shipping" ||
                                orderStatusUpdates[order.trackingCode] ===
                                  "shipping") && (
                                <div className="relative flex items-center gap-4">
                                  <div className="absolute left-[-22px] w-5 h-5 rounded-full bg-blue-500 border-4 border-blue-100"></div>
                                  <div className="flex-1 bg-blue-50 p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-blue-700">
                                        Đang giao hàng
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(new Date())}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Đơn hàng đang được vận chuyển đến bạn
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Delivered Status - show only if relevant */}
                              {(order.status === "delivered" ||
                                orderStatusUpdates[order.trackingCode] ===
                                  "delivered") && (
                                <div className="relative flex items-center gap-4">
                                  <div className="absolute left-[-22px] w-5 h-5 rounded-full bg-purple-500 border-4 border-purple-100"></div>
                                  <div className="flex-1 bg-purple-50 p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-purple-700">
                                        Đã giao hàng
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(new Date())}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Đơn hàng đã được giao thành công
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Cancelled Status - show only if relevant */}
                              {(order.status === "cancelled" ||
                                orderStatusUpdates[order.trackingCode] ===
                                  "cancelled") && (
                                <div className="relative flex items-center gap-4">
                                  <div className="absolute left-[-22px] w-5 h-5 rounded-full bg-red-500 border-4 border-red-100"></div>
                                  <div className="flex-1 bg-red-50 p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-red-700">
                                        Đã hủy
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(new Date())}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Đơn hàng đã bị hủy
                                    </p>
                                    {order.products &&
                                      order.products.length > 0 && (
                                        <div className="mt-3 bg-white p-2 rounded-lg border border-red-100">
                                          <p className="text-sm text-gray-700">
                                            <InfoCircleOutlined className="text-blue-500 mr-2" />
                                            {order.products.length > 1 ? (
                                              <>
                                                Bạn vẫn có thể mua lại các sản
                                                phẩm trong đơn hàng này bằng
                                                cách nhấn nút "Mua lại tất cả"
                                                bên dưới.
                                              </>
                                            ) : (
                                              <>
                                                Bạn vẫn có thể mua lại sản phẩm
                                                trong đơn hàng này bằng cách
                                                nhấn nút "Mua lại".
                                              </>
                                            )}
                                          </p>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="relative z-10"
                description={
                  <span className="text-gray-500 text-lg">
                    {searchTerm
                      ? "Không tìm thấy đơn hàng phù hợp với từ khóa tìm kiếm"
                      : "Bạn chưa có đơn hàng nào"}
                  </span>
                }
              >
                <Link to="/product">
                  <button
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full 
                      hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-lg font-medium"
                  >
                    <ShoppingOutlined className="mr-2" />
                    Mua sắm ngay
                  </button>
                </Link>
              </Empty>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersHistoryPage;
