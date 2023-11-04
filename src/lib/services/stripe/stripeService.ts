import { appConfig } from '@/config';
import Stripe from 'stripe';

const stripeService = new Stripe(appConfig.stripeSecretKey, {
  apiVersion: '2023-10-16',
});

export default stripeService;
