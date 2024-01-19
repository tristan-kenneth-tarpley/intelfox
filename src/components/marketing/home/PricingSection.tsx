import { CheckIcon } from '@heroicons/react/20/solid';
import Button from '@/components/ui/Button';
import {
  Card, CardContent, CardFooter, CardHeader,
} from '@/components/ui/card';
import Text from '@/components/ui/Text';
import Heading from '@/components/ui/Heading';
import { routes } from '@/app/routes';
import { hotPink, orange } from '../../../../palette';

const tiers = [
  {
    name: 'Beta access',
    id: 'beta-access',
    href: routes.signup(),
    priceMonthly: '$29',
    description: 'Modi dolorem expedita deleniti. Corporis iste qui inventore pariatur adipisci vitae.',
    features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics', '48-hour support response time'],
  },
];

const PricingSection = () => {
  return (
    <div className="isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-96 pt-24 text-center sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-base font-semibold leading-7 text-orange-400">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The right price for you, <br className="hidden sm:inline lg:hidden" />
            whoever you are
          </p>
        </div>
        <div className="relative mt-6">
          <p className="mx-auto max-w-2xl text-lg leading-8 text-white/60">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos odit doloribus
            molestiae voluptatum.
          </p>
          <svg
            viewBox="0 0 1208 1024"
            className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
          >
            <ellipse cx={604} cy={512} fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)" rx={604} ry={512} />
            <defs>
              <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
                <stop stopColor={orange[600]} />
                <stop offset={1} stopColor={hotPink[500]} />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flow-root pb-24 sm:pb-32">
        <div className="-mt-80">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:w-1/2 md:w-3/4 w-11/12">
              {tiers.map((tier) => (
                <Card key={tier.id}>
                  <CardHeader>
                    <Heading level={3} className="text-base font-semibold leading-7 text-orange-600">
                      {tier.name}
                    </Heading>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 flex items-baseline gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-zinc-200">{tier.priceMonthly}</span>
                      <span className="text-base font-semibold leading-7 text-zinc-400">/month</span>
                    </div>
                    <Text className="mt-6 text-base leading-7">{tier.description}</Text>
                    <ul role="list" className="mt-10 space-y-4 text-sm leading-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon className="h-6 w-5 flex-none text-orange-600" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button
                      href={tier.href}
                      aria-describedby={tier.id}
                      size="lg"
                      className="w-full justify-center"
                    >
                      Get started today
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
