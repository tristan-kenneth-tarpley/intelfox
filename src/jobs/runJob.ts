import { appConfig } from '@/config';
import forwardRequestToZeplo from '@/lib/services/zeplo/forwardRequestToZeplo';

type IsSingleObjectParameter<T> = T extends (param: infer U) => any ?
  U extends object ? true : false : false;

const runJob = async <TJobFn extends (arg: any) => any>(
  job: IsSingleObjectParameter<TJobFn> extends true ? TJobFn : never,
  payload: IsSingleObjectParameter<TJobFn> extends true ? Parameters<TJobFn>[0] : never,
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
      {
        _retry: '3|exponential|2',
      },
    );
  }
};

export default runJob;
