"use client";

import { useState } from "react";
import InputField from "@/components/ui/Input";
import handleUrlInputOnChange from "@/utils/handleUrlInputOnChange";

const DomainInput = ({ initialValue }: { initialValue: string }) => {
  const [domain, setDomain] = useState(initialValue);

  return (
    <div className="w-full">
      <InputField
        type="url"
        className="w-1/2"
        placeholder="https://yourwebsite.com"
        name="company_url"
        required
        value={domain}
        onChange={handleUrlInputOnChange(setDomain)}
      />
    </div>
  );
};

export default DomainInput;
