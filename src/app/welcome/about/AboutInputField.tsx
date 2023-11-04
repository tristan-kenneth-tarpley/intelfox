'use client';

import InputField from '@/components/ui/Input';
import { useState } from 'react';

const AboutInputField = ({ initialValue }: { initialValue: string }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <InputField
      name="about_company"
      textArea
      style={{ minHeight: '200px' }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default AboutInputField;
