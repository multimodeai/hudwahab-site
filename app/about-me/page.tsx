import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import HeroSection from "@/components/HeroSection";
import BackgroundSection from "@/components/BackgroundSection";
import CredibilitySection from "@/components/CredibilitySection";
import WorkSection from "@/components/WorkSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "About — Hud Wahab",
  description:
    "Hud Wahab — ML engineer building AI for defense systems and autonomous AI. 20+ publications, federal AI contracts, and production ML through Multimode AI LLC.",
};

export default function AboutMe() {
  return (
    <main>
      <SiteNav active="about" />
      <HeroSection
        label="ABOUT ME"
        greeting=""
        heading="My name is Hud Wahab and I'm an ML engineer building AI at the intersection of defense systems and autonomous AI."
        imageSrc="/hud-river.jpg"
        imageAlt="Hud Wahab crossing a river on a backcountry trek"
        imagePosition="object-[center_40%]"
      />
      <FadeIn><BackgroundSection /></FadeIn>
      <FadeIn><CredibilitySection /></FadeIn>
      <FadeIn><WorkSection /></FadeIn>
      <FadeIn><ServicesSection /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
      <FadeIn><SiteFooter /></FadeIn>
    </main>
  );
}
