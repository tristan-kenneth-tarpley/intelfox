'use client';

import { appConfig } from '@/config';
import Nango from '@nangohq/frontend';
import { useEffect, useRef, useState } from 'react';

const nango = new Nango({ publicKey: appConfig.nangoPublicKey });

const OAuthPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [authError, setAuthError] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }
    nango
      .auth('reddit', 'tristan')
      .then(
        (res) => {
          console.log('res', res);
          setIsSuccess(true);
          setAuthError(false);
          // fetch('/api/auth', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({
          //     connectionId,
          //     source: providerConfigKey,
          //   }),
          // }).then((res) => {
          //   if (res.status !== 200) {
          //     setIsSuccess(false);
          //     setAuthError(true);
          //     return;
          //   }

          //   setIsSuccess(true);
          // });
        },
      )
      .catch((err) => {
        console.log('err', err);
        setAuthError(true);
        setIsSuccess(false);
      })
      .finally(() => {
        hasRun.current = true;
      });
  }, []);

  return isSuccess ? <p>You are all good to go</p> : authError ? <p>There was an error</p> : <p>Authenticating...</p>;
};

export default OAuthPage;
