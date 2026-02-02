import CategoriesSection from "./_components/categories-section";
import Footer from "./_components/footer";
import { HeroSection } from "./_components/hero-section";
import FeaturedSection from "./_components/posts-featured";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <FeaturedSection />
        {/* <CategoriesSection /> */}
        <Footer />
      </main>
    </div>
  );
}
