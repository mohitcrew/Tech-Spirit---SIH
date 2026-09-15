import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CertificatesController],
})
export class CertificatesModule {}
