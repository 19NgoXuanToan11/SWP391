import {
  HomeOutlined,
  UserOutlined,
  ShoppingOutlined,
  ContactsOutlined,
  LoginOutlined,
} from "@ant-design/icons";

export function SiteHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: "2rem" }}>
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#ec4899", // pink-500
              }}
            >
              Skincare
            </span>
          </a>
        </div>
        <nav
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <a
              href="/"
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#666666",
                textDecoration: "none",
                transition: "color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
              onMouseOver={(e) => (e.target.style.color = "#ec4899")}
              onMouseOut={(e) => (e.target.style.color = "#666666")}
            >
              <HomeOutlined /> Home
            </a>
            <a
              href="/about"
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#666666",
                textDecoration: "none",
                transition: "color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
              onMouseOver={(e) => (e.target.style.color = "#ec4899")}
              onMouseOut={(e) => (e.target.style.color = "#666666")}
            >
              <UserOutlined /> About
            </a>
            <a
              href="/product"
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#666666",
                textDecoration: "none",
                transition: "color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
              onMouseOver={(e) => (e.target.style.color = "#ec4899")}
              onMouseOut={(e) => (e.target.style.color = "#666666")}
            >
              <ShoppingOutlined /> Product
            </a>
            <a
              href="/contact"
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#666666",
                textDecoration: "none",
                transition: "color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
              onMouseOver={(e) => (e.target.style.color = "#ec4899")}
              onMouseOut={(e) => (e.target.style.color = "#666666")}
            >
              <ContactsOutlined /> Contact
            </a>
          </div>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#ec4899",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <LoginOutlined /> Sign In
          </button>
        </nav>
      </div>
    </header>
  );
}
