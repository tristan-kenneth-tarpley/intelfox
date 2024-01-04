import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import usePrevious from '@/hooks/usePrevious';
import { useToast } from './use-toast';

const ToastOnFormCompletion = ({
  message,
  title,
}: { message?: string; title?: string }) => {
  const { toast } = useToast();
  const { pending } = useFormStatus();
  const prevPending = usePrevious(pending);

  useEffect(() => {
    if (prevPending && !pending) {
      toast({ description: message, title });
    }
  }, [
    prevPending,
    pending,
    toast,
    message,
    title,
  ]);

  return null;
};

export default ToastOnFormCompletion;
