import BreadcrumbMenu from '@/components/ui/Breadcrumb';
import { routes } from '../routes';

const steps = [
  {
    name: 'Domain',
    href: routes.welcome(),
  },
  {
    name: 'Keywords',
    href: routes.welcomeKeywords(),
  },
  {
    name: 'About company',
    href: routes.welcomeAbout(),
  },
  {
    name: 'Pick competitors',
    href: routes.welcomeCompetitors(),
  },
] as const;

const foo = steps.map((step) => step.name);

const WelcomeBreadcrumb = ({ activeName }: { activeName: typeof foo[number] }) => {
  const pages = steps.map((step) => ({
    ...step,
    current: step.name === activeName,
  }));

  return (
    <div className="mb-8">
      <BreadcrumbMenu pages={pages} />
    </div>
  );
};

export default WelcomeBreadcrumb;
