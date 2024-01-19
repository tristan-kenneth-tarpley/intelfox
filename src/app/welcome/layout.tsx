import LogoWordMarque from "@/components/LogoWordMarque";
import RotatingBackgroundGradient from "@/components/marketing/home/RotatingBackgroundGradient";
import BackgroundGrid from "@/components/marketing/home/BackgroundGrid";

const WelcomeLayout = ({ children }: { children: React.ReactNode }) => {
  // todo:
  // validate URL by scraping and trying to return some data
  // otherwise, let the user move on manually

  return (
    <div className="w-full min-h-screen max-w-screen overflow-hidden relative">
      <div className="bg-zinc-200 bg-opacity-70">
        <RotatingBackgroundGradient />
        <BackgroundGrid />
      </div>
      <div className="container mx-auto p-4 w-11/12 md:w-3/4 z-10 relative">
        <div className="w-full flex justify-center mb-12">
          <LogoWordMarque />
        </div>
        {children}
      </div>
    </div>
  );
};

export default WelcomeLayout;
