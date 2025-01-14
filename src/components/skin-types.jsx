const skinTypes = [
  {
    title: "Oily skin",
    description:
      "High amount of sebum, skin exhibits continuing oiliness throughout the day and appears shiny or greasy.",
    image: "https://via.placeholder.com/400x300?text=OilySkin",
  },
  {
    title: "Acne skin",
    description:
      "Acne is a common skin condition characterized by whiteheads, blackheads, and inflammation of the skin.",
    image: "https://via.placeholder.com/400x300?text=AcneSkin",
  },
  {
    title: "Dry skin",
    description:
      "To keep the skin healthy and hydrated, use a gentle cleanser and apply a healthy water lock in spread cream.",
    image: "https://via.placeholder.com/400x300?text=DrySkin",
  },
];

export function SkinTypes() {
  return (
    <section style={{ padding: "4rem 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <h2
          style={{
            marginBottom: "3rem",
            textAlign: "center",
            fontSize: "1.875rem",
            fontWeight: "bold",
            color: "#ec4899",
          }}
        >
          KNOW YOUR SKIN
        </h2>
        <div
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns:
              window.innerWidth > 768 ? "repeat(3, 1fr)" : "1fr",
          }}
        >
          {skinTypes.map((type) => (
            <div key={type.title} style={{ position: "relative" }}>
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <img
                  src={type.image}
                  alt={type.title}
                  style={{
                    height: "300px",
                    width: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                />
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                {type.title}
              </h3>
              <p
                style={{
                  color: "#666666",
                  marginBottom: "1rem",
                }}
              >
                {type.description}
              </p>
              <button
                style={{
                  color: "#ec4899",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Get Started →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
