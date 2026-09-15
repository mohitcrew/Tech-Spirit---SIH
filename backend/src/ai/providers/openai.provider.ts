import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, ChatMessage, ChatResponse } from './ai-provider.interface';
import { MockAiProvider } from './mock.provider';

@Injectable()
export class OpenAiProvider implements AiProvider {
  constructor(
    private readonly config: ConfigService,
    private readonly mockProvider: MockAiProvider,
  ) {}

  async chat(messages: ChatMessage[], userContext?: any): Promise<ChatResponse> {
    const apiKey = this.config.get<string>('AI_API_KEY');
    const baseUrl = this.config.get<string>('AI_BASE_URL') || 'https://api.openai.com/v1';
    const model = this.config.get<string>('AI_MODEL') || 'gpt-4o-mini';

    if (!apiKey) {
      // Fallback to Mock Provider when no key is set
      return this.mockProvider.chat(messages, userContext);
    }

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are SkillSync AI, the intelligent EdTech and capacity building assistant for SkillSync. Answer questions clearly about skills, roles, competencies, courses, and trainers with friendly, professional advice.',
            },
            ...messages,
          ],
        }),
      });

      if (!response.ok) {
        return this.mockProvider.chat(messages, userContext);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'I am unable to formulate a response right now.';
      return { reply };
    } catch {
      return this.mockProvider.chat(messages, userContext);
    }
  }
}
