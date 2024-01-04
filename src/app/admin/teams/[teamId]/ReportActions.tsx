'use client';

import handleDailyTeamSyncSubmission from '@/app/actions/admin/handleDailyTeamSyncSubmission';
import handleGenerateIntelReportCommand from '@/app/actions/admin/handleGenerateIntelReportCommand';
import handlePrepIntelReportCommand from '@/app/actions/admin/handlePrepIntelReportCommand';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';
import ToastOnFormCompletion from '@/components/ui/ToastOnFormCompletion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import VStack from '@/components/ui/stack/VStack';
import { Teams } from '@prisma/client/edge';
import { useFormState } from 'react-dom';

const ReportActions = ({ team }: { team: Teams }) => {
  const [prepState, prepFormAction] = useFormState(handlePrepIntelReportCommand, { teamId: team.id });
  const [generateState, generateFormAction] = useFormState(handleGenerateIntelReportCommand, { teamId: team.id });
  const [teamSyncState, teamSyncFormAction] = useFormState(handleDailyTeamSyncSubmission, { teamId: team.id });

  return (
    <VStack align="start">
      <form action={teamSyncFormAction}>
        <FormStatusWrapper>
          {({ pending }) => (
            <Button loading={pending} type="submit" variant="outline">Scrape Reddit</Button>
          )}
        </FormStatusWrapper>
      </form>
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

      <ToastOnFormCompletion title={prepState.title ?? 'Report prepped'} message={prepState.message} />
      <ToastOnFormCompletion title={'Daily sync has started'} message={teamSyncState.message} />
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
