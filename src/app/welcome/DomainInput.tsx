'use client';

import InputField from '@/components/ui/Input';
import { useState } from 'react';

const DomainInput = () => {
  const [domain, setDomain] = useState('');

  return (
    <div className="w-full">
      <InputField
        type="url"
        className="w-full"
        placeholder='yourwebsite.com'
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
    </div>
  );
};

export default DomainInput;
