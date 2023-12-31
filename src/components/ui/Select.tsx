import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/primitives/select';

interface Option {
  id: string;
  name: string;
}

export default function Select({
  options,
  selected: selectedValue,
  onChange,
}: {
  options: Option[];
  selected?: Option;
  onChange?: (id: string) => void,
}) {
  return (
    <SelectPrimitive onValueChange={(e) => onChange?.(e)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={selectedValue?.name} defaultValue={selectedValue?.name} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ id, name }) => (
          <SelectItem
            key={id}
            value={id}
          >
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive>
  );
}
