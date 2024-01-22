import RotatingBackgroundGradient from "@/components/marketing/home/RotatingBackgroundGradient";
import BackgroundGrid from "@/components/marketing/home/BackgroundGrid";
import WelcomeNavbar from "@/components/navbar/WelcomeNavbar";

const WelcomeLayout = ({ children }: { children: React.ReactNode }) => {
  // todo:
  // validate URL by scraping and trying to return some data
  // otherwise, let the user move on manually

  return (
    <div className="w-full min-h-screen max-w-screen overflow-hidden relative">
      <div className="bg-zinc-950 z-20 sticky top-0">
        <WelcomeNavbar />
      </div>
      <div className="bg-zinc-200 bg-opacity-70">
        <RotatingBackgroundGradient />
        <BackgroundGrid />
      </div>
      <div className="container mx-auto mt-12 p-4 w-11/12 md:w-3/4 z-10 relative">
        {children}
      </div>
    </div>
  );
};

export default WelcomeLayout;
