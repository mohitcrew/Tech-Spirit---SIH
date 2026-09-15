export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: string;
  isPersonalizedPrompt?: boolean;
  suggestedActions?: Array<{ label: string; action: string }>;
}

export interface AiProvider {
  chat(messages: ChatMessage[], userContext?: any): Promise<ChatResponse>;
}
