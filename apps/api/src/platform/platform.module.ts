import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { EventsModule } from '../events/events.module';

// Events & Outbox
import { OutboxService } from './events/outbox/outbox.service';
import { EventConsumerService } from './events/consumers/event-consumer.service';

// Authentication & Authorization
import { ApiKeyService } from './authentication/api-keys/api-key.service';
import { ApiKeyGuard } from './authentication/api-keys/api-key.guard';
import { OAuthService } from './authentication/oauth/oauth.service';
import { ScopesGuard } from './authorization/scopes/scopes.guard';
import { DataAccessPolicyService } from './authorization/policies/data-access-policy.service';

// Webhooks
import { WebhookService } from './webhooks/webhook.service';
import { WebhookController } from './webhooks/webhook.controller';

// Integrations
import { LogisticsAdapter } from './integrations/adapters/logistics.adapter';
import { PaymentsAdapter } from './integrations/adapters/payments.adapter';
import { FpoAdapter } from './integrations/adapters/fpo.adapter';
import { AgricultureAdapter } from './integrations/adapters/agriculture.adapter';
import { MessagingAdapter } from './integrations/adapters/messaging.adapter';
import { IntegrationRegistryService } from './integrations/registry/integration-registry.service';
import { IntegrationHealthService } from './integrations/health/integration-health.service';
import { IntegrationService } from './integrations/integration.service';
import { IntegrationController } from './integrations/integration.controller';

// Data Platform
import { DataExportService } from './data/exports/data-export.service';
import { DataExportController } from './data/exports/data-export.controller';
import { OfflineSyncService } from './data/sync/offline-sync.service';
import { OfflineSyncController } from './data/sync/offline-sync.controller';
import { DataPrivacyService } from './data/privacy/data-privacy.service';

// Voice
import { VoiceInterfaceService } from './voice/voice-interface.service';
import { VoiceInterfaceController } from './voice/voice-interface.controller';

// Rate Limits & Observability
import { RateLimiterService } from './rate-limits/rate-limiter.service';
import { RateLimiterGuard } from './rate-limits/rate-limiter.guard';
import { PlatformAuditService } from './observability/platform-audit.service';
import { ApiObservabilityMiddleware } from './observability/api-observability.middleware';

// Versioned APIs
import { PlatformV1Controller } from './api/v1/platform-v1.controller';

@Module({
  imports: [EventsModule],
  controllers: [
    PlatformV1Controller,
    WebhookController,
    IntegrationController,
    DataExportController,
    OfflineSyncController,
    VoiceInterfaceController,
  ],
  providers: [
    // Events
    OutboxService,
    EventConsumerService,

    // Auth & Guards
    ApiKeyService,
    ApiKeyGuard,
    OAuthService,
    ScopesGuard,
    DataAccessPolicyService,

    // Webhooks
    WebhookService,

    // Integrations & Adapters
    LogisticsAdapter,
    PaymentsAdapter,
    FpoAdapter,
    AgricultureAdapter,
    MessagingAdapter,
    IntegrationRegistryService,
    IntegrationHealthService,
    IntegrationService,

    // Data Platform
    DataExportService,
    OfflineSyncService,
    DataPrivacyService,

    // Voice
    VoiceInterfaceService,

    // Rate Limits & Audit
    RateLimiterService,
    RateLimiterGuard,
    PlatformAuditService,
  ],
  exports: [
    OutboxService,
    EventConsumerService,
    ApiKeyService,
    ApiKeyGuard,
    OAuthService,
    ScopesGuard,
    DataAccessPolicyService,
    WebhookService,
    IntegrationService,
    IntegrationRegistryService,
    DataExportService,
    OfflineSyncService,
    DataPrivacyService,
    VoiceInterfaceService,
    RateLimiterService,
    PlatformAuditService,
  ],
})
export class PlatformModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiObservabilityMiddleware).forRoutes('v1', 'platform');
  }
}

