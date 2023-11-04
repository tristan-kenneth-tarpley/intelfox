import { appConfig } from '@/config';
import Stripe from 'stripe';

const stripe = new Stripe(appConfig.stripeSecretKey, {
  apiVersion: '2023-10-16',
});

export default stripe;
