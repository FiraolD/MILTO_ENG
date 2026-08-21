import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HeroSection, AboutSection } from "./HeroAbout";
import { ServicesSection, ProjectsSection } from "./ServicesProjectTeam";
import { ContactSection } from "./ContactSection";
import GallerySection from "./GallerySection";
export default function PublicViews() {
    return (_jsxs("main", { children: [_jsx(HeroSection, {}), _jsx(AboutSection, {}), _jsx(ServicesSection, {}), _jsx(ProjectsSection, {}), _jsx(GallerySection, {}), _jsx(ContactSection, {})] }));
}
