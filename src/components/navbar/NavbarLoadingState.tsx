import { Skeleton } from '../ui/skeleton';
import NavbarSkeleton from './NavbarSkeleton';

const NavbarLoadingState = () => (
  <NavbarSkeleton
    links={[
      <Skeleton key={1} className="w-[100px] h-6" />,
      <Skeleton key={2} className="w-[100px] h-6" />,
    ]}
    rightContent={<Skeleton className="rounded-full w-10 h-10" />}
  />
);

export default NavbarLoadingState;
