import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessage, ChatResponse } from './providers/ai-provider.interface';
import { MockAiProvider } from './providers/mock.provider';
import { OpenAiProvider } from './providers/openai.provider';

@Injectable()
export class AiService {
  constructor(
    private readonly config: ConfigService,
    private readonly mockProvider: MockAiProvider,
    private readonly openAiProvider: OpenAiProvider,
  ) {}

  async processChat(messages: ChatMessage[], userContext?: any): Promise<ChatResponse> {
    const hasApiKey = Boolean(this.config.get<string>('AI_API_KEY'));

    if (hasApiKey) {
      return this.openAiProvider.chat(messages, userContext);
    }

    return this.mockProvider.chat(messages, userContext);
  }
}
