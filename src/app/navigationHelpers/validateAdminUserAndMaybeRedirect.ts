import { adminUserIdsSet } from '@/config/adminUsers';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { routes } from '../routes';

const validateAdminUserAndMaybeRedirect = async () => {
  const user = await currentUser();

  if (!user?.id || !adminUserIdsSet.has(user.id)) {
    return redirect(routes.root());
  }
};

export default validateAdminUserAndMaybeRedirect;
