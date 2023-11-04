import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import ActionContainer from '@/components/ui/ActionContainer';
import WelcomeBreadcrumb, { WelcomeBreadcrumbActiveName } from './WelcomeBreadcrumb';
import { FormAction } from '../types';

const WelcomeContainer = ({
  activeName,
  heading,
  subheading,
  children,
  actions,
  formAction,
}: {
  activeName: WelcomeBreadcrumbActiveName;
  heading: string;
  subheading: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
  formAction: FormAction;
}) => {
  return (
    <div>
      <WelcomeBreadcrumb activeName={activeName} />
      <div className="flex flex-col space-y-4">
        <div>
          <Heading level={1} displayAs={3}>{heading}</Heading>
          <Text>{subheading}</Text>
        </div>
        <form action={formAction}>
          <div className="flex flex-col space-y-4">
            <div className="w-full flex items-stretch flex-col space-y-2">
              {children}
            </div>
            <ActionContainer>
              {actions}
            </ActionContainer>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WelcomeContainer;
