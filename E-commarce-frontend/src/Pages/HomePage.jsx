import Footer from "@/components/Landing/Footer";
import Header from "@/components/Landing/Header";
import BenefitsSection from "@/components/Landing/BenefitsSection";
import CategoriesSection from "@/components/Landing/CategoriesSection";
import DealsBannerSection from "@/components/Landing/DealsBannerSection";
import LandingProductsSection from "@/components/Landing/LandingProductsSection";
import HeroSection from "@/components/Landing/HeroSection";
import NewsletterSection from "@/components/Landing/NewsletterSection";
import TestimonialsSection from "@/components/Landing/TestimonialsSection";
import { useQuery } from "@tanstack/react-query";
import { getDataForHomePage } from "../APIs/HomePageServices";

const categoriesIcons = [
  { name: "Laptops", icon: "Laptop" },
  { name: "Smartphones", icon: "Smartphone" },
  { name: "Tablets", icon: "Tablet" },
  { name: "Headphones", icon: "Headphones" },
  { name: "Smart Watches", icon: "Watch" },
  { name: "Computer Accessories", icon: "Keyboard" },
  { name: "Gaming Accessories", icon: "Gamepad2" },
  { name: "Smart Home", icon: "Home" },
  { name: "Monitors", icon: "Monitor" },
  { name: "Cameras", icon: "Camera" },
];

export default function HomePage() {
  let content = null;
  const { data, error, isError } = useQuery({
    queryKey: ["categories-Home"],
    queryFn: getDataForHomePage,
  });

  if (error || isError) {
    content = (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
            <p className="font-semibold">Failed to load data.</p>
            <p className="mt-2 text-sm">{error.message}</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  } else {
    content = (
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <CategoriesSection
          categories={data?.categories}
          icons={categoriesIcons}
        />
        <LandingProductsSection
          products={data?.bestSellers}
          title="Best Sellers"
          subtitle="Top selling products"
          badgeOverride="Best Seller"
        />
        <DealsBannerSection deals={data?.limitedDeals} />
        <LandingProductsSection
          products={data?.newArrivals}
          title="New Arrivals"
          subtitle="Fresh tech, just landed"
          badgeOverride="New"
        />
        <LandingProductsSection
          products={data?.topRated}
          title="Top Rated"
          subtitle="Top rated products"
          badgeOverride="TopRated"
        />
        <LandingProductsSection
          products={data?.MostWishlisted}
          title="Fevorite Products"
          subtitle="Most wishlisted products"
          badgeOverride="Fevorite"
        />
        <BenefitsSection />
        <TestimonialsSection testimonials={data?.testimonials} />
        <NewsletterSection />
        <Footer />
      </div>
    );
  }
  return content;
}
