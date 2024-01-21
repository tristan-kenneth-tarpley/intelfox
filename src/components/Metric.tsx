import Text from "./ui/Text";
import VStack from "./ui/stack/VStack";

const Metric = ({
  value,
  label,
  subLabel,
}: {
  value: string;
  label: string | React.ReactNode;
  subLabel?: string | React.ReactNode;
}) => {
  return (
    <VStack align="start" space={2}>
      <div className="text-3xl font-semibold">{value}</div>
      <Text>{label}</Text>
      {subLabel && (
        <Text size="xs" className="text-zinc-400">
          {subLabel}
        </Text>
      )}
    </VStack>
  );
};

export default Metric;
