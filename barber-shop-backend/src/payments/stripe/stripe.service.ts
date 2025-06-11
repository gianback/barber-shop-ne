import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from '../dtos/create-checkout-session.dto';
import { ServicesService } from 'src/services/services.service';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Injectable()
export class StripeService {
  constructor(
    @Inject('STRIPE') private readonly stripe: Stripe,
    private readonly configService: ConfigService,
    private readonly servicesService: ServicesService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async createCheckoutSession(
    createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    const service = await this.servicesService.getServiceById(
      createCheckoutSessionDto.serviceId,
    );

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
                slug: service.slug,
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

      payment_intent_data: {
        metadata: {
          appointmentId: createCheckoutSessionDto.appointmentId,
        },
      },
    });

    return {
      url: session.url,
    };
  }

  async handleWebhook(signature: string, body: Buffer<ArrayBufferLike>) {
    const webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET_KEY') || '';

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

      if (event.type === 'payment_intent.succeeded') {
        const session = event.data.object;

        const appointmentId = Number(session.metadata?.appointmentId);

        await this.appointmentsService.updateStatusAppointment(
          appointmentId,
          true,
        );

        return {
          success: true,
        };
      }
    } catch (err) {
      console.log('Invalid request webhook', err);

      return {
        success: false,
      };
    }
  }
}
