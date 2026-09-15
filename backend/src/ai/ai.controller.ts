import { Body, Controller, Post, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatMessage } from './providers/ai-provider.interface';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(
    @Body('messages') messages: ChatMessage[],
    @Req() req: any,
  ) {
    const userContext = req.user || null;
    return this.aiService.processChat(messages || [], userContext);
  }
}
