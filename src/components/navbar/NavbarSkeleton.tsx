import { padding } from '@/app/home/[teamId]/styles';
import { NAVBAR_HEIGHT } from '@/constants/dimensions';
import Logo from '../Logo';
import HStack from '../ui/stack/HStack';

const NavbarSkeleton = ({
  rightContent,
  links,
}: {
  rightContent?: React.ReactNode,
  links?: React.ReactNode[],
}) => (
  <div style={{ height: NAVBAR_HEIGHT }}>
    <HStack className={`h-full bg-zinc-900 bg-opacity-20 ${padding} border-b border-solid border-zinc-800`} justify="between">
      <HStack space={4}>
        <Logo />
        <HStack>
          {links}
        </HStack>
      </HStack>
      {rightContent}
    </HStack>
  </div>
);

export default NavbarSkeleton;
