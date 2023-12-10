'use client';

import handleGenerateIntelReportCommand from '@/app/actions/admin/handleGenerateIntelReportCommand';
import handlePrepIntelReportCommand from '@/app/actions/admin/handlePrepIntelReportCommand';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import Button from '@/components/ui/Button';
import CalloutSection from '@/components/ui/CalloutSection';
import Text from '@/components/ui/Text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import VStack from '@/components/ui/stack/VStack';
import { Teams } from '@prisma/client/edge';
import { useFormState } from 'react-dom';

const ReportActions = ({ team }: { team: Teams }) => {
  const [prepState, prepFormAction] = useFormState(handlePrepIntelReportCommand, { teamId: team.id });
  const [generateState, generateFormAction] = useFormState(handleGenerateIntelReportCommand, { teamId: team.id });

  return (
    <VStack align="start">
      <form action={prepFormAction}>
        <FormStatusWrapper>
          {({ pending }) => (
            <Button loading={pending} type="submit" variant="outline">Prepare resources for report</Button>
          )}
        </FormStatusWrapper>
      </form>
      <form action={generateFormAction}>
        <FormStatusWrapper>
          {({ pending }) => (
            <Button
              variant="outline"
              loading={pending}
            >
              Generate report
            </Button>
          )}
        </FormStatusWrapper>
      </form>

      {prepState.message && <CalloutSection header={prepState.title ?? 'Report prepped'} message={prepState.message} theme={'success'} />}
      {generateState.reportText && (
        <Popover>
          <PopoverTrigger>
            <Button>View report draft</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="max-h-[500px] overflow-scroll">
              <Text className="whitespace-pre-line">{generateState.reportText}</Text>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </VStack>
  );
};

export default ReportActions;
