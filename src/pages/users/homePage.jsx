import React from "react";
import { HeroSection } from "../../components/hero-section";
import { ProductSlider } from "../../components/product-slider";
import { ProductsSection } from "../../components/products-section";
import { SkinTypes } from "../../components/skin-types";

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <ProductSlider />
      <SkinTypes />
      <ProductsSection />
    </div>
  );
}
