import HStack from '@/components/ui/stack/HStack';
import Logo from '@/components/Logo';
import Button from '@/components/ui/Button';
import { Teams } from '@prisma/client';
import { padding } from './styles';
import NavbarRight from './NavbarRight';

const Navbar = ({
  team,
}: {
  team: Teams,
}) => {
  return (
    <HStack className={`bg-zinc-900 bg-opacity-20 ${padding} border-b border-solid border-zinc-800`} justify="between">
      <HStack space={4}>
        <Logo />
        <HStack>
          <Button variant='ghost'>Button one</Button>
          <Button variant="ghost">Button one</Button>
        </HStack>
      </HStack>
      <NavbarRight team={team} />
    </HStack>
  );
};

export default Navbar;
