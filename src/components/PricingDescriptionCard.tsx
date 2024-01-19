import Heading from "./ui/Heading";
import Text from "./ui/Text";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import VStack from "./ui/stack/VStack";

const PricingDescriptionCard = ({
  description,
  children,
  heading = "We got this information from your pricing page:",
}: {
  description?: string;
  heading?: string;
  children: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <Heading level={1} displayAs={6}>
          {heading}
        </Heading>
      </CardHeader>
      <CardContent>
        {description === undefined ? (
          <VStack align="start">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </VStack>
        ) : (
          <Text>{description}</Text>
        )}
      </CardContent>
      <CardFooter>{children}</CardFooter>
    </Card>
  );
};

export default PricingDescriptionCard;
