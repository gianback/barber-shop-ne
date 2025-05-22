import { ServicesDto } from '../dtos/services.dto';

export interface CreateServiceProps {
  service: ServicesDto;
  userId: number;
  image: Express.Multer.File;
}
