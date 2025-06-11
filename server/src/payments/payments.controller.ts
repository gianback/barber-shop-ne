import {
  Body,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post('create-checkout-session')
  @UseGuards(AuthGuard())
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    return await this.paymentService.createCheckoutSession(
      createCheckoutSessionDto,
    );
  }

  @Post('webhook')
  handleWebhook(
    @Headers('Stripe-Signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const raw = req.rawBody as Buffer<ArrayBufferLike>;

    return this.paymentService.handleWebhook(signature, raw);
  }
}
