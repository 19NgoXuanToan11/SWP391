import React from "react";
import { HeroSection } from "../../components/hero-section";
import { ProductSlider } from "../../components/product-slider";
import { ProductsSection } from "../../components/products-section";
import { SkinTypes } from "../../components/skin-types";
import { BlogPage } from "../../components/blogPage";
import { NewsPage } from "../../components/newsPage";

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <ProductSlider />
      <SkinTypes />
      <BlogPage />
      <ProductsSection />
      <NewsPage />
    </div>
  );
}
