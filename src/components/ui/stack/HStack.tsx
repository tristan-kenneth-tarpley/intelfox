import { StackProps } from './types';
import Stack from './Stack';

const HStack = ({
  children,
  ...rest
}: Omit<StackProps, 'direction'>) => {
  return (
    <Stack direction='row' {...rest}>{children}</Stack>
  );
};

export default HStack;
