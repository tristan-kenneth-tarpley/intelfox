import { FormStateHandler } from '../types';

const handleKeyPhraseSubmission: FormStateHandler<{ teamId: string; message?: string }> = async (
  { teamId },
  formData,
) => {
  console.log('formdata', formData.entries());
  return { teamId };
};

export default handleKeyPhraseSubmission;
