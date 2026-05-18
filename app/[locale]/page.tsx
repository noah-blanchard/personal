import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Experience } from "@/components/experience/Experience";
import { Tech } from "@/components/Tech";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

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
