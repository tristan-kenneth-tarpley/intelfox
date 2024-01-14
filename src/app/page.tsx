import RotatingBackgroundGradient from '@/components/marketing/home/RotatingBackgroundGradient';
import BackgroundGrid from '@/components/marketing/home/BackgroundGrid';
import HeroRight from '@/components/marketing/home/HeroRight';
import HeroLeft from '@/components/marketing/home/HeroLeft';
import MarketingPageNavbar from '@/components/navbar/MarketingPageNavbar';
import AboutSection from '@/components/marketing/home/AboutSection';
import PricingSection from '@/components/marketing/home/PricingSection';

const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden bg-zinc-950">
      <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-zinc-950 pt-[7%]" />
      <RotatingBackgroundGradient />
      <BackgroundGrid />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <HeroLeft />
        <HeroRight />
      </div>
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
    </div>
  );
}

export default Home;
