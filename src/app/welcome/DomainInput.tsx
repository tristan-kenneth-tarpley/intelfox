'use client';

import InputField from '@/components/ui/Input';
import { useState } from 'react';

const DomainInput = ({ initialValue }: { initialValue: string }) => {
  const [domain, setDomain] = useState(initialValue);

  return (
    <div className="w-full">
      <InputField
        type="url"
        className="w-full"
        placeholder='https://yourwebsite.com'
        name="company_url"
        required
        value={domain}
        onChange={(e) => {
          const { value } = e.target;
          if (
            value.length > 'https://'.length
            && !value.startsWith('https://')
          ) {
            setDomain(`https://${e.target.value}`);
          } else {
            setDomain(e.target.value);
          }
        }}
      />
    </div>
  );
};

export default DomainInput;
