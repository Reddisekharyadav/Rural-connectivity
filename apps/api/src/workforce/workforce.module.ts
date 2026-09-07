import { Module } from '@nestjs/common';
import { WorkforceWorkerService } from './workers/worker.service';
import { WorkforceWorkerController } from './workers/worker.controller';
import { WorkforceSkillService } from './skills/skill.service';
import { WorkforceSkillController } from './skills/skill.controller';
import { WorkforceCertificationService } from './certifications/certification.service';
import { WorkforceCertificationController } from './certifications/certification.controller';
import { WorkforceExperienceService } from './experience/experience.service';
import { WorkforceExperienceController } from './experience/experience.controller';
import { WorkforceJobService } from './jobs/job.service';
import { WorkforceJobController } from './jobs/job.controller';
import { WorkforceApplicationService } from './applications/application.service';
import { WorkforceApplicationController } from './applications/application.controller';
import { WorkforceOfferService } from './offers/offer.service';
import { WorkforceOfferController } from './offers/offer.controller';
import { WorkforceAssignmentService } from './assignments/assignment.service';
import { WorkforceAssignmentController } from './assignments/assignment.controller';
import { WorkforceAttendanceService } from './attendance/attendance.service';
import { WorkforceAttendanceController } from './attendance/attendance.controller';
import { WorkforceRankingService } from './matching/worker-ranking.service';
import { WorkforceMatchingService } from './matching/worker-matching.service';
import { WorkforceHistoryService } from './history/work-history.service';
import { WorkforceHistoryController } from './history/work-history.controller';

@Module({
  controllers: [
    WorkforceWorkerController,
    WorkforceSkillController,
    WorkforceCertificationController,
    WorkforceExperienceController,
    WorkforceJobController,
    WorkforceApplicationController,
    WorkforceOfferController,
    WorkforceAssignmentController,
    WorkforceAttendanceController,
    WorkforceHistoryController,
  ],
  providers: [
    WorkforceWorkerService,
    WorkforceSkillService,
    WorkforceCertificationService,
    WorkforceExperienceService,
    WorkforceJobService,
    WorkforceApplicationService,
    WorkforceOfferService,
    WorkforceAssignmentService,
    WorkforceAttendanceService,
    WorkforceRankingService,
    WorkforceMatchingService,
    WorkforceHistoryService,
  ],
  exports: [
    WorkforceWorkerService,
    WorkforceSkillService,
    WorkforceJobService,
    WorkforceApplicationService,
    WorkforceOfferService,
    WorkforceAssignmentService,
    WorkforceAttendanceService,
    WorkforceMatchingService,
    WorkforceHistoryService,
  ],
})
export class WorkforceModule {}
