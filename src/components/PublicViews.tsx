import { HeroSection, AboutSection } from "./HeroAbout";
import { ServicesSection, ProjectsSection } from "./ServicesProjectTeam";
import { ContactSection } from "./ContactSection";
import GallerySection from "./GallerySection";

export default function PublicViews() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <GallerySection />
      <ContactSection />
    </main>
  );
}