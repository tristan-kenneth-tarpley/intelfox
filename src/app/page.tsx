import RotatingBackgroundGradient from "@/components/marketing/home/RotatingBackgroundGradient";
import BackgroundGrid from "@/components/marketing/home/BackgroundGrid";
import HeroRight from "@/components/marketing/home/HeroRight";
import HeroLeft from "@/components/marketing/home/HeroLeft";
import MarketingPageNavbar from "@/components/navbar/MarketingPageNavbar";
import AboutSection from "@/components/marketing/home/AboutSection";
import PricingSection from "@/components/marketing/home/PricingSection";
import BouncingDownArrow from "@/components/ui/BouncingDownArrow";
// import { ChevronDownIcon } from '@radix-ui/react-icons';

const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden bg-zinc-950">
      <RotatingBackgroundGradient />
      <BackgroundGrid />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <HeroLeft />
        <HeroRight />
      </div>
      <div
        id="find-me"
        className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-zinc-950 pt-[7%]"
      />
    </div>
  );
};

function Home() {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-zinc-950">
        <MarketingPageNavbar />
      </div>
      <Hero />
      <AboutSection />
      <PricingSection />
      <div className="absolute bottom-5 w-screen flex justify-center">
        <BouncingDownArrow />
      </div>
    </div>
  );
}

export default Home;
