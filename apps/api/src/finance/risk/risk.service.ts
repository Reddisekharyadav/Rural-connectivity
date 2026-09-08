import { Injectable, Logger } from '@nestjs/common';
import { WithdrawalService } from '../withdrawals/withdrawal.service';

@Injectable()
export class RiskService {
  private readonly logger = new Logger(RiskService.name);

  constructor(private readonly withdrawalService: WithdrawalService) {}

  async assessWithdrawalRisk(userId: string, requestedAmount: number) {
    const recentWithdrawals = await this.withdrawalService.getWithdrawals(userId);
    const dailyTotal = recentWithdrawals.reduce((sum, w) => sum + w.amount, 0) + requestedAmount;
    const isVelocityWarning = dailyTotal > 50000;

    return {
      userId,
      requestedAmount,
      dailyWithdrawalVolume: dailyTotal,
      riskLevel: isVelocityWarning ? 'MEDIUM_RISK' : 'LOW_RISK',
      recommendedAction: isVelocityWarning ? 'MANUAL_REVIEW' : 'AUTO_APPROVE',
    };
  }
}

