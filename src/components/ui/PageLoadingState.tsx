import classNames from 'classnames';
import { WORKSPACE_HEIGHT } from '@/constants/dimensions';
import { Skeleton } from '@/components/ui/skeleton';
import NavbarLoadingState from '@/components/navbar/NavbarLoadingState';
import { innerPadding } from '@/app/styles';

const PageLoadingState = () => {
  return (
    <div className="h-screen w-screen">
      <NavbarLoadingState />
      <div className={classNames(innerPadding, 'flex flex-col space-y-2')} style={{ height: WORKSPACE_HEIGHT }}>
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-8 w-[400px]" />
        <Skeleton className="h-8 w-[400px]" />
      </div>
    </div>
  );
};

export default PageLoadingState;
