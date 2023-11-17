import BreadcrumbMenu from '@/components/ui/Breadcrumb';

const steps = [
  {
    name: 'Domain',
    href: '',
  },
  {
    name: 'About company',
    href: '',
  },
  {
    name: 'Pick competitors',
    href: '',
  },
  {
    name: 'Key phrases',
    href: '',
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
