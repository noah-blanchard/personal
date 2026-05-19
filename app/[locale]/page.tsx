import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/home/Hero";
import { Work } from "@/components/home/Work";
import { About } from "@/components/home/About";
import { Experience } from "@/components/experience/Experience";
import { Tech } from "@/components/home/Tech";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Work />
        <About />
        <Experience />
        <Tech />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
