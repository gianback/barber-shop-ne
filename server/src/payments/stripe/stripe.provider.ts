import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
export const StripeProvider = {
  provide: 'STRIPE',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const stripeSecretKey = config.get<string>('STRIPE_SECRET_API_KEY') || '';

    return new Stripe(stripeSecretKey);
  },
};
