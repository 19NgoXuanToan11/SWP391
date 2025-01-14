export function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "#f0fdf9", // mint-50 equivalent
        padding: "5rem 0",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: window.innerWidth > 1024 ? "1fr 1fr" : "1fr",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <h1
              style={{
                fontSize:
                  window.innerWidth > 1280
                    ? "3.75rem"
                    : window.innerWidth > 640
                    ? "3rem"
                    : "2.25rem",
                fontWeight: "bold",
                letterSpacing: "-0.05em",
                color: "#ec4899", // pink-500
              }}
            >
              Be comfortable in your skin
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#666666",
              }}
            >
              Your journey into skin care starts here. We build customized
              health and wellness plans after careful assessment of your skin
              condition.
            </p>
          </div>
          <div style={{ position: "relative" }}>
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
                    borderRadius: "9999px", // rounded-full
                  }}
                >
                  <img
                    src={`https://via.placeholder.com/200x200?text=Treatment${i}`}
                    alt={`Skincare Treatment ${i}`}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
