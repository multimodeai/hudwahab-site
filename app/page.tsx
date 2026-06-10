import SiteNav from "@/components/SiteNav";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import MoreAboutMe from "@/components/MoreAboutMe";
import ServicesTeaser from "@/components/ServicesTeaser";
import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  return (
    <main>
      <SiteNav />
      <HeroSection />
      <FadeIn><SkillsSection /></FadeIn>
      <FadeIn><MoreAboutMe /></FadeIn>
      <FadeIn><ServicesTeaser /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
      <FadeIn><SiteFooter /></FadeIn>
    </main>
  );
}
