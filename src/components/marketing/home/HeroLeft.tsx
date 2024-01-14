import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import HStack from "@/components/ui/stack/HStack";
import VStack from "@/components/ui/stack/VStack";

const COPY = {
  header: "Did you hear what that person said about you?",
  subheader: "Intelfox is your intelligence analyst that monitors online conversations, finds people ready to buy, and sends them to your inbox 1-2x per month.",
} as const;

const HeroLeft = () => {
  return (
    <VStack align="start" className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
      <span className="rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold leading-6 text-orange-400 ring-1 ring-inset ring-orange-500/20">
        Intelfox &mdash; beta
      </span>
      <Heading level={1} className="text-4xl sm:text-6xl">
        {COPY.header}
      </Heading>
      <Text size="base" className="text-lg leading-8 text-gray-300">
        {COPY.subheader}
      </Text>
      <HStack>
        <Button size="lg">Get started</Button>
      </HStack>
    </VStack>
  );
};

export default HeroLeft;
