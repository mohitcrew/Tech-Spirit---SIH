import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, ChatMessage, ChatResponse } from './ai-provider.interface';
import { MockAiProvider } from './mock.provider';

@Injectable()
export class GeminiAiProvider implements AiProvider {
  private readonly logger = new Logger(GeminiAiProvider.name);

  constructor(
    private readonly config: ConfigService,
    private readonly mockProvider: MockAiProvider,
  ) {}

  async chat(messages: ChatMessage[], userContext?: any): Promise<ChatResponse> {
    const apiKey = this.config.get<string>('GEMINI_API_KEY') || this.config.get<string>('AI_API_KEY');
    const model = this.config.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash';

    if (!apiKey) {
      return this.mockProvider.chat(messages, userContext);
    }

    try {
      // Map messages to Gemini format: user | model
      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Prepend system context to the first user message or instructions
      const systemInstruction = {
        parts: [
          {
            text: 'You are SkillSync AI, the intelligent EdTech and competency development assistant for the SkillSync platform. Provide helpful, accurate, and encouraging advice about courses, skills, career roadmaps, assessments, and certifications. Format your answers clearly using markdown when helpful.',
          },
        ],
      };

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction,
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        this.logger.warn(`Gemini API returned error ${res.status}: ${errorText}`);
        return this.mockProvider.chat(messages, userContext);
      }

      const data = await res.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'I am ready to assist you with your SkillSync learning journey.';

      return { reply };
    } catch (err: any) {
      this.logger.error(`Gemini chat error: ${err.message}`);
      return this.mockProvider.chat(messages, userContext);
    }
  }
}
