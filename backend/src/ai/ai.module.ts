import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { MockAiProvider } from './providers/mock.provider';
import { OpenAiProvider } from './providers/openai.provider';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [AiService, MockAiProvider, OpenAiProvider],
  exports: [AiService],
})
export class AiModule {}
