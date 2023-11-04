import BreadcrumbMenu from '@/components/ui/Breadcrumb';
import { routes } from '../routes';

const steps = [
  {
    name: 'Domain',
    href: routes.welcome(),
  },
  {
    name: 'About company',
    href: routes.welcomeAbout(),
  },
  {
    name: 'Keywords',
    href: routes.welcomeKeywords(),
  },
  {
    name: 'Pick competitors',
    href: routes.welcomeCompetitors(),
  },
] as const;

const stepNames = steps.map((step) => step.name);

export type WelcomeBreadcrumbActiveName = typeof stepNames[number];

const WelcomeBreadcrumb = ({ activeName }: { activeName: WelcomeBreadcrumbActiveName }) => {
  const pages = steps.map((step) => ({
    ...step,
    current: step.name === activeName,
    disabled: true,
  }));

  return (
    <div className="mb-8">
      <BreadcrumbMenu pages={pages} />
    </div>
  );
};

export default WelcomeBreadcrumb;
