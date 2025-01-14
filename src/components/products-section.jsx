export function ProductsSection() {
  return (
    <section style={{ backgroundColor: "#f5f5f5", padding: "4rem 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div
          style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  overflow: "hidden",
                  borderRadius: "0.5rem",
                  backgroundColor: "white",
                  padding: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={`https://via.placeholder.com/200x200?text=Product${i}`}
                  alt={`Skincare Product ${i}`}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#ec4899", // pink-500 equivalent
              }}
            >
              PRODUCTS
            </h2>
            <p style={{ color: "#666666" }}>
              Good skin care involves keeping your skin clean, moisturized, and
              protected from the sun. Our products are carefully selected from
              these concepts to provide hydration, antioxidants, sun protection
              and other benefits that your skin needs. We offer products that
              appreciate for your skin from within. Make a good skin care
              routine for best results.
            </p>
            <button
              style={{
                backgroundColor: "#ec4899",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.25rem",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#db2777")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#ec4899")}
            >
              View all
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
