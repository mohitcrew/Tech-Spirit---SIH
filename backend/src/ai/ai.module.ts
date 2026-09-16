import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { MockAiProvider } from './providers/mock.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { GeminiAiProvider } from './providers/gemini.provider';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [AiService, MockAiProvider, OpenAiProvider, GeminiAiProvider],
  exports: [AiService],
})
export class AiModule {}
