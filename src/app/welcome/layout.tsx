import LogoWordMarque from '@/components/LogoWordMarque';
import Image from 'next/image';
import background from './background.svg';

const WelcomeLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // todo:
  // validate URL by scraping and trying to return some data
  // otherwise, let the user move on manually

  return (
    <div className="w-full">
      <div className="absolute top-40 opacity-60 z-0">
        <Image src={background} alt="" />
      </div>
      <div className="container mx-auto p-4 w-1/2 z-10 relative">
        <div className="w-full flex justify-center mb-12">
          <LogoWordMarque />
        </div>
        {children}
      </div>
    </div>
  );
};

export default WelcomeLayout;
