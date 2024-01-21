import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import ActionContainer from "@/components/ui/ActionContainer";
import WelcomeBreadcrumb, {
  WelcomeBreadcrumbActiveName,
} from "./WelcomeBreadcrumb";
import { FormAction } from "../types";

const WelcomeContainer = ({
  activeName,
  heading,
  subheading,
  children,
  actions,
  dialog,
  onSubmit,
  formAction,
}: {
  activeName: WelcomeBreadcrumbActiveName;
  heading: string;
  subheading: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
  dialog?: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  formAction: FormAction;
}) => {
  return (
    <div>
      <WelcomeBreadcrumb activeName={activeName} />
      <div className="flex flex-col space-y-4">
        <div>
          <Heading level={1} displayAs={2}>
            {heading}
          </Heading>
          <Text size="base">{subheading}</Text>
        </div>
        <form
          onSubmit={(e) => {
            if (!onSubmit) {
              return;
            }
            e.preventDefault();
            onSubmit?.(e);
          }}
          action={onSubmit ? undefined : formAction}
        >
          <div className="flex flex-col space-y-4">
            <div className="w-full flex items-stretch flex-col space-y-4">
              {children}
            </div>
            <ActionContainer>{actions}</ActionContainer>
            {dialog && dialog}
          </div>
        </form>
      </div>
    </div>
  );
};

export default WelcomeContainer;
