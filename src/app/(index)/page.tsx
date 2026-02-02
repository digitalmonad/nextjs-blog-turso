import { SectionCategories } from "./_components/section-categories";
import { Footer } from "./_components/footer";
import { SectionHero } from "./_components/section-hero";
import { SectionPostsFeatured } from "./_components/section-posts-featured";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <SectionHero />
        <SectionPostsFeatured />
        <SectionCategories />
        <Footer />
      </main>
    </div>
  );
}
