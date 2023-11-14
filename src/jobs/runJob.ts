import { appConfig } from '@/config';
import forwardRequestToZeplo from '@/lib/services/zeplo/forwardRequestToZeplo';

const runJob = (
  job: (...args: any[]) => any,
  payload: Record<string, any>,
) => {
  if (appConfig.nodeEnv === 'development') {
    return job(payload as any);
  }

  if (appConfig.nodeEnv === 'production') {
    console.log('running job', job.name, payload);
    return forwardRequestToZeplo(
      `https://${appConfig.selfUrl}/api/jobs/exec`,
      {
        method: 'POST',
        body: JSON.stringify({ payload, jobName: job.name }),
        headers: {
          authorization: `Bearer ${appConfig.cronSecret}`,
        },
      },
    );
  }
};

export default runJob;
