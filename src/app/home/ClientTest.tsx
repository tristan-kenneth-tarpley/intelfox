'use client';

import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import { useEffect } from 'react';

const ClientTest = () => {
  const { setActive, userMemberships, organizationList } = useOrganizationList();
  const org = useOrganization();

  useEffect(() => {
    console.log(org.organization, userMemberships, organizationList);
    if (!org.organization) {
      setActive?.({ organization: organizationList[0].organization.id });
    }
  }, [org.organization, setActive, userMemberships.data]);

  return <p>I was rendered by the client</p>;
};

export default ClientTest;
