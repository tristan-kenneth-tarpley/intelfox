"use client";

import InputField from "@/components/ui/Input";
import { useState } from "react";

const CompanyNameInputField = ({ initialValue }: { initialValue: string }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <InputField
      name="company_name"
      className="w-1/2"
      value={value}
      required
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default CompanyNameInputField;
