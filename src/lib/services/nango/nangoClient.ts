import { appConfig } from '@/config';
import { Nango } from '@nangohq/node';

const nango = new Nango({ secretKey: appConfig.nangoSecretKey ?? '' });

export default nango;
