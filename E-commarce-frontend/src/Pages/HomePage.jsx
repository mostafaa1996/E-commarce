import Footer from "@/components/Landing/Footer";
import Header from "@/components/Landing/Header";
import BenefitsSection from "@/components/Landing/BenefitsSection";
import CategoriesSection from "@/components/Landing/CategoriesSection";
import DealsBannerSection from "@/components/Landing/DealsBannerSection";
import FeaturedProductsSection from "@/components/Landing/FeaturedProductsSection";
import HeroSection from "@/components/Landing/HeroSection";
import NewArrivalsSection from "@/components/Landing/NewArrivalsSection";
import NewsletterSection from "@/components/Landing/NewsletterSection";
import TestimonialsSection from "@/components/Landing/TestimonialsSection";
import {
  categories,
  featuredProducts,
  newArrivals,
  testimonials,
} from "@/Data/Products";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection products={featuredProducts} />
      <DealsBannerSection />
      <NewArrivalsSection products={newArrivals} />
      <BenefitsSection />
      <TestimonialsSection testimonials={testimonials} />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
