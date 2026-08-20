import { HeroSection, AboutSection } from "./HeroAbout";
import { ServicesSection, ProjectsSection } from "./ServicesProjectTeam";
import { ContactSection } from "./ContactSection";
import NewsTicker from "./NewsTicker";
import GallerySection from "./GallerySection";

export default function PublicViews() {
  return (
    <main>
      <NewsTicker />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <GallerySection />
      <ContactSection />
    </main>
  );
}