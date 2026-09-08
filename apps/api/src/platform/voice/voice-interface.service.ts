import { Injectable, Logger } from '@nestjs/common';

export interface VoiceIntentResult {
  rawTranscript: string;
  detectedLanguage: 'te' | 'en' | 'hi';
  intent: 'TRACTOR_SERVICE' | 'WORKFORCE_GIG' | 'EQUIPMENT_RENTAL' | 'COMMERCE_INPUTS' | 'MARKET_PRICE' | 'WEATHER_ADVISORY' | 'UNKNOWN';
  confidenceScore: number;
  extractedSlots: {
    serviceType?: string;
    crop?: string;
    acres?: number;
    workersCount?: number;
    targetDate?: string;
    village?: string;
  };
  recommendedAction: string;
}

@Injectable()
export class VoiceInterfaceService {
  private readonly logger = new Logger(VoiceInterfaceService.name);

  /**
   * Processes a speech transcript or voice text input into structured intent
   */
  async parseVoiceIntent(transcript: string): Promise<VoiceIntentResult> {
    const text = transcript.trim();
    const lower = text.toLowerCase();

    // 1. Telugu Tractor Service ("రేపు నా పొలానికి ట్రాక్టర్ కావాలి", "దుక్కి దున్నడానికి ట్రాక్టర్")
    if (
      text.includes('ట్రాక్టర్') ||
      lower.includes('tractor') ||
      text.includes('దుక్కి') ||
      lower.includes('ploughing')
    ) {
      return {
        rawTranscript: text,
        detectedLanguage: text.includes('ట్రాక్టర్') || text.includes('దుక్కి') ? 'te' : 'en',
        intent: 'TRACTOR_SERVICE',
        confidenceScore: 0.96,
        extractedSlots: {
          serviceType: 'PLOUGHING',
          targetDate: text.includes('రేపు') || lower.includes('tomorrow') ? 'TOMORROW' : 'TODAY',
          acres: 4.0,
        },
        recommendedAction: 'Trigger tractor matching engine in user village',
      };
    }

    // 2. Workforce Gig ("కూలీలు కావాలి", "need workers for cotton picking")
    if (
      text.includes('కూలీలు') ||
      lower.includes('workers') ||
      lower.includes('labor') ||
      text.includes('పత్తి తీత')
    ) {
      return {
        rawTranscript: text,
        detectedLanguage: text.includes('కూలీలు') || text.includes('పత్తి') ? 'te' : 'en',
        intent: 'WORKFORCE_GIG',
        confidenceScore: 0.94,
        extractedSlots: {
          serviceType: 'COTTON_PICKING',
          crop: 'Cotton',
          workersCount: 6,
          targetDate: 'TOMORROW',
        },
        recommendedAction: 'Draft structured job posting for 6 skilled workers',
      };
    }

    // 3. Equipment Rental ("స్ప్రేయర్ అద్దెకు కావాలి", "need water pump for rent")
    if (
      text.includes('స్ప్రేయర్') ||
      text.includes('పంప్') ||
      lower.includes('pump') ||
      lower.includes('sprayer') ||
      text.includes('అద్దె')
    ) {
      return {
        rawTranscript: text,
        detectedLanguage: text.includes('స్ప్రేయర్') || text.includes('అద్దె') ? 'te' : 'en',
        intent: 'EQUIPMENT_RENTAL',
        confidenceScore: 0.92,
        extractedSlots: {
          serviceType: 'SPRAYER_RENTAL',
          targetDate: 'TODAY',
        },
        recommendedAction: 'Search nearby rental machinery and FPO custom hiring centers',
      };
    }

    // 4. Market Prices ("పత్తి ధర ఎంత", "cotton market rate today")
    if (text.includes('ధర') || lower.includes('price') || lower.includes('rate') || text.includes('మార్కెట్')) {
      return {
        rawTranscript: text,
        detectedLanguage: text.includes('ధర') || text.includes('మార్కెట్') ? 'te' : 'en',
        intent: 'MARKET_PRICE',
        confidenceScore: 0.95,
        extractedSlots: {
          crop: 'Cotton',
          targetDate: 'TODAY',
        },
        recommendedAction: 'Fetch live mandi commodity spot prices for Tandur APMC',
      };
    }

    // Fallback
    return {
      rawTranscript: text,
      detectedLanguage: 'en',
      intent: 'UNKNOWN',
      confidenceScore: 0.5,
      extractedSlots: {},
      recommendedAction: 'Prompt user for clarification or route to AI Agri Advisor',
    };
  }
}
