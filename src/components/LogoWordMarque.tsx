import Logo from './Logo';
import Heading from './ui/Heading';
import Text from './ui/Text';

const LogoWordMarque = () => {
  return (
    <div className="flex items-center space-x-2">
      <Logo />
      <Text>|</Text>
      <Heading level={6}>IntelFox</Heading>
    </div>
  );
};

export default LogoWordMarque;
