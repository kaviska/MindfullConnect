import { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Nav from "@/components/home/Nav";
import Counseller from "@/components/home/Counsellor";
import Footer from "@/components/home/Footer";
import CounselingLandingSections from "@/components/home/WhyChoose-us";

export const metadata: Metadata = {
  title: "Mindfull Connect - Professional Mental Health Counseling",
  description:
    "Connect with certified mental health professionals. Book online therapy sessions, get personalized counseling, and take control of your mental wellness journey.",
  keywords:
    "mental health, counseling, therapy, online sessions, mental wellness",
  openGraph: {
    title: "Mindfull Connect - Professional Mental Health Counseling",
    description:
      "Connect with certified mental health professionals for personalized therapy sessions.",
    type: "website",
  },
};

export default function Main() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Nav />

      {/* Main Content */}
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative">
          <Hero />
        </section>

        {/* Counselors Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <Counseller />
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4">
            <CounselingLandingSections />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}