import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from '../dtos/create-checkout-session.dto';
import { ServicesService } from 'src/services/services.service';

@Injectable()
export class StripeService {
  constructor(
    @Inject('STRIPE') private readonly stripe: Stripe,
    private readonly configService: ConfigService,
    private readonly servicesService: ServicesService,
  ) {}

  async createCheckoutSession(
    createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    const service = await this.servicesService.getServiceById(
      createCheckoutSessionDto.serviceId,
    );

    console.log(service);

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'pen',
            product_data: {
              name: service.name,
              images: [service.image],
              description: service.description,
              metadata: {
                appointmentId: createCheckoutSessionDto.appointmentId,
              },
            },
            unit_amount: service.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${this.configService.get<string>('FRONTEND_URL')}/payment-success`,
      cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/payment-cancel`,
    });

    return {
      url: session.url,
    };
  }

  handleWebhook(signature: string, body: Buffer<ArrayBufferLike>) {
    const webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
    if (!signature || !body) {
      throw new Error('Invalid request');
    }
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          // let paymentIntent = event.data.object;

          //todo editar el appointment y actualizar el status
          console.log(event.data.object);

          break;
        default:
          console.log('Unhandled event type: ', event.type);
      }
      return {
        success: true,
      };
    } catch (err) {
      console.log('Invalid request webhook');

      return {
        success: false,
      };
    }
  }
}
