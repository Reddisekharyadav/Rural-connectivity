import { Controller, Post, Body } from '@nestjs/common';
import { VoiceInterfaceService } from './voice-interface.service';

@Controller('platform/voice')
export class VoiceInterfaceController {
  constructor(private readonly voiceService: VoiceInterfaceService) {}

  @Post('intent')
  async parseIntent(@Body('transcript') transcript: string) {
    return this.voiceService.parseVoiceIntent(transcript || '');
  }
}

