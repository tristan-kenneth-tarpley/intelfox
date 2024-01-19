import Spinner, { SpinnerVariant } from "./Spinner";
import Text from "./Text";
import HStack from "./stack/HStack";

const SpinnerWithText = ({
  text,
  variant = "orange",
}: {
  text: string;
  variant?: SpinnerVariant;
}) => (
  <HStack>
    <Spinner variant={variant} />
    <Text>{text}</Text>
  </HStack>
);

export default SpinnerWithText;
