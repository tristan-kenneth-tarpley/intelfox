import { FormStatus, useFormStatus } from 'react-dom';

const FormStatusWrapper = ({
  children,
}: {
  children: (formStatus: FormStatus) => React.ReactNode;
}) => {
  const formStatus = useFormStatus();

  return children(formStatus);
};

export default FormStatusWrapper;
