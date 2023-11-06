import LogoWordMarque from '@/components/LogoWordMarque';
import Image from 'next/image';
import bgAlt from './background.svg';

const WelcomeLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // todo:
  // validate URL by scraping and trying to return some data
  // otherwise, let the user move on manually

  return (
    <div className="w-full min-h-screen max-w-screen overflow-hidden">
      <div className="w-screen h-screen absolute opacity-30 z-0">
        <Image className="w-full h-full" src={bgAlt} alt="" />
      </div>
      <div className="container mx-auto p-4 w-11/12 md:w-3/4 lg:w-1/2 z-10 relative">
        <div className="w-full flex justify-center mb-12">
          <LogoWordMarque />
        </div>
        {children}
      </div>
    </div>
  );
};

export default WelcomeLayout;
