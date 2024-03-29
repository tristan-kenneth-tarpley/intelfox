import BreadcrumbMenu from "@/components/ui/Breadcrumb";

const steps = [
  {
    name: "URL",
    href: "",
  },
  {
    name: "About you",
    href: "",
  },
  {
    name: "About your competitors",
    href: "",
  },
  {
    name: "Competitor info",
    href: "",
  },
] as const;

const stepNames = steps.map((step) => step.name);

export type WelcomeBreadcrumbActiveName = (typeof stepNames)[number];

const WelcomeBreadcrumb = ({
  activeName,
}: {
  activeName: WelcomeBreadcrumbActiveName;
}) => {
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
