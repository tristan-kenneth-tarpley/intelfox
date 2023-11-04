import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import ActionContainer from '@/components/ui/ActionContainer';
import WelcomeBreadcrumb, { WelcomeBreadcrumbActiveName } from './WelcomeBreadcrumb';

const WelcomeContainer = ({
  activeName,
  heading,
  subheading,
  children,
  actions,
}: {
  activeName: WelcomeBreadcrumbActiveName;
  heading: string;
  subheading: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
}) => {
  return (
    <div>
      <WelcomeBreadcrumb activeName={activeName} />
      <div className="flex flex-col space-y-4">
        <div>
          <Heading level={1} displayAs={3}>{heading}</Heading>
          <Text>{subheading}</Text>
        </div>
        <div className="w-full flex items-stretch flex-col space-y-2">
          {children}
        </div>
        <ActionContainer>
          {actions}
        </ActionContainer>
      </div>
    </div>
  );
};

export default WelcomeContainer;
