import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe/stripe.service';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';

@Injectable()
export class PaymentsService {
  constructor(private stripeService: StripeService) {}

  async createCheckoutSession(
    createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    return await this.stripeService.createCheckoutSession(
      createCheckoutSessionDto,
    );
  }

  handleWebhook(signature: string, body: Buffer<ArrayBufferLike>) {
    return this.stripeService.handleWebhook(signature, body);
  }
}
