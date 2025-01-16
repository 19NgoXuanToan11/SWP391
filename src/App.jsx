import "./global.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { HeroSection } from "./components/hero-section";
import { ProductsSection } from "./components/products-section";
import { SkinTypes } from "./components/skin-types";
import { ProductSlider } from "./components/product-slider";

function App() {
  return (
    <div className="App">
      <SiteHeader />
      <main>
        <HeroSection />
        <ProductSlider />
        <SkinTypes />
        <ProductsSection />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
