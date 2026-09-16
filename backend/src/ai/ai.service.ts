import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessage, ChatResponse } from './providers/ai-provider.interface';
import { MockAiProvider } from './providers/mock.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { GeminiAiProvider } from './providers/gemini.provider';

@Injectable()
export class AiService {
  constructor(
    private readonly config: ConfigService,
    private readonly mockProvider: MockAiProvider,
    private readonly openAiProvider: OpenAiProvider,
    private readonly geminiProvider: GeminiAiProvider,
  ) {}

  async processChat(messages: ChatMessage[], userContext?: any): Promise<ChatResponse> {
    const hasGeminiKey = Boolean(
      this.config.get<string>('GEMINI_API_KEY') || this.config.get<string>('AI_API_KEY'),
    );

    if (hasGeminiKey) {
      return this.geminiProvider.chat(messages, userContext);
    }

    const hasOpenAiKey = Boolean(this.config.get<string>('OPENAI_API_KEY'));
    if (hasOpenAiKey) {
      return this.openAiProvider.chat(messages, userContext);
    }

    return this.mockProvider.chat(messages, userContext);
  }
}
