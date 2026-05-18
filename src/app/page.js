import Hero from "@/Sections/Hero";
import OurFleetPartners from "@/Sections/OurFleetPartners";
import Reviews from "@/Sections/Reviews";

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Static Sections 1 */}
      <OurFleetPartners />

      {/* Static Sections 2 */}
      <Reviews />
    </div>
  );
}
