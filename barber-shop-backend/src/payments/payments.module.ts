import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe/stripe.service';
import { StripeModule } from './stripe/stripe.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { StripeProvider } from './stripe/stripe.provider';
import { ServicesModule } from 'src/services/services.module';
import { UsersService } from 'src/users/users.service';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { R2StorageService } from 'src/upload-file/r2/r2.service';
import { r2Provider } from 'src/upload-file/r2/r2.provider';

@Module({
  imports: [AuthModule, ServicesModule, StripeModule],
  providers: [
    PaymentsService,
    StripeService,
    StripeProvider,
    ConfigService,
    UsersService,
    UploadFileService,
    R2StorageService,
    r2Provider,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
