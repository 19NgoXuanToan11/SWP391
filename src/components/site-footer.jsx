export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: window.innerWidth > 1024 ? "1fr 1fr" : "1fr",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#ec4899", // pink-500
              }}
            >
              Get our wellness checked
            </h3>
            <p
              style={{
                marginTop: "0.5rem",
                color: "#666666",
              }}
            >
              Prior to the facial area test on your skin care with our
              professional skin care specialist and complete medical expertise.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <a
              href="#"
              style={{
                color: "#666666",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#ec4899")}
              onMouseOut={(e) => (e.target.style.color = "#666666")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="#"
              style={{
                color: "#666666",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#ec4899")}
              onMouseOut={(e) => (e.target.style.color = "#666666")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              style={{
                color: "#666666",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#ec4899")}
              onMouseOut={(e) => (e.target.style.color = "#666666")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
