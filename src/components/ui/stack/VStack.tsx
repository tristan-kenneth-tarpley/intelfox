import { StackProps } from './types';
import Stack from './Stack';

const VStack = ({
  children,
  ...rest
}: Omit<StackProps, 'direction'>) => {
  return (
    <Stack direction='column' {...rest}>{children}</Stack>
  );
};

export default VStack;
