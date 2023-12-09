'use client';

import handlePrepIntelReportCommand from '@/app/actions/admin/handlePrepIntelReportCommand';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import Button from '@/components/ui/Button';
import CalloutSection from '@/components/ui/CalloutSection';
import VStack from '@/components/ui/stack/VStack';
import { Teams } from '@prisma/client/edge';
import { useFormState } from 'react-dom';

const ReportActions = ({ team }: { team: Teams }) => {
  const [prepState, prepFormAction] = useFormState(handlePrepIntelReportCommand, { teamId: team.id });

  return (
    <VStack align="start">
      <form action={prepFormAction}>
        <FormStatusWrapper>
          {({ pending }) => (
            <Button loading={pending} type="submit" variant="outline">Prepare resources for report</Button>
          )}
        </FormStatusWrapper>
      </form>
      <Button disabled={true} variant="outline">Generate report (still working here)</Button>

      {prepState.message && <CalloutSection header={prepState.title ?? 'Report prepped'} message={prepState.message} theme={'success'} />}
    </VStack>
  );
};

export default ReportActions;
