import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface CheckInDto {
  assignmentId: string;
  workerId: string;
  date?: string;
  verificationMethod?: 'SELF_REPORTED' | 'CONTRACTOR_CONFIRMED' | 'OTP' | 'LOCATION';
  otpCode?: string;
  notes?: string;
}

export interface CheckOutDto {
  checkOutAt?: string;
  notes?: string;
}

@Injectable()
export class WorkforceAttendanceService {
  private records = new Map<string, any>([
    [
      'att-01',
      {
        id: 'att-01',
        assignmentId: 'asgn-02',
        workerId: 'wp-laxman-004',
        workerName: 'Laxman Naik',
        date: '2026-09-12',
        checkInAt: '2026-09-12T06:35:00Z',
        checkOutAt: '2026-09-12T11:45:00Z',
        status: 'PRESENT',
        hoursWorked: 5.1,
        verificationMethod: 'CONTRACTOR_CONFIRMED',
        verifiedBy: 'usr-ravi-001 (Farmer Ravi Kumar)',
        notes: 'Sprayed 4.5 acres cotton field with micronutrient formula. On time and clean operation.',
        createdAt: '2026-09-12T06:35:00Z',
      },
    ],
  ]);

  async checkIn(dto: CheckInDto) {
    const today = dto.date || new Date().toISOString().split('T')[0];
    const existing = Array.from(this.records.values()).find(
      (r) => r.assignmentId === dto.assignmentId && r.workerId === dto.workerId && r.date === today
    );

    if (existing) {
      throw new BadRequestException('Attendance already recorded for today.');
    }

    const id = `att-${Date.now().toString(36)}`;
    const newRecord = {
      id,
      assignmentId: dto.assignmentId,
      workerId: dto.workerId,
      workerName: dto.workerId === 'wp-laxman-004' ? 'Laxman Naik' : 'Checked-in Worker',
      date: today,
      checkInAt: new Date().toISOString(),
      checkOutAt: null,
      status: 'PRESENT',
      hoursWorked: 0,
      verificationMethod: dto.verificationMethod || 'SELF_REPORTED',
      verifiedBy: dto.verificationMethod === 'CONTRACTOR_CONFIRMED' ? 'Site Supervisor' : null,
      notes: dto.notes || 'Worker checked in for field assignment.',
      createdAt: new Date().toISOString(),
    };

    this.records.set(id, newRecord);
    return newRecord;
  }

  async checkOut(recordId: string, dto: CheckOutDto) {
    const record = this.records.get(recordId);
    if (!record) {
      throw new NotFoundException(`Attendance record ${recordId} not found`);
    }

    const checkOutTime = dto.checkOutAt || new Date().toISOString();
    record.checkOutAt = checkOutTime;
    
    // Calculate hours worked
    if (record.checkInAt) {
      const start = new Date(record.checkInAt).getTime();
      const end = new Date(checkOutTime).getTime();
      const diffHrs = Math.max(0.5, Math.round(((end - start) / 3600000) * 10) / 10);
      record.hoursWorked = diffHrs;
    } else {
      record.hoursWorked = 8.0;
    }

    if (dto.notes) {
      record.notes = `${record.notes} | ${dto.notes}`;
    }

    this.records.set(recordId, record);
    return record;
  }

  async getAssignmentAttendance(assignmentId: string) {
    return Array.from(this.records.values()).filter((r) => r.assignmentId === assignmentId);
  }

  async getWorkerAttendance(workerId: string) {
    return Array.from(this.records.values()).filter((r) => r.workerId === workerId);
  }

  async confirmBySupervisor(recordId: string, supervisorId: string, notes?: string) {
    const record = this.records.get(recordId);
    if (!record) {
      throw new NotFoundException(`Attendance record ${recordId} not found`);
    }

    record.verificationMethod = 'CONTRACTOR_CONFIRMED';
    record.verifiedBy = supervisorId;
    if (notes) {
      record.notes = `${record.notes} | Confirmed by supervisor: ${notes}`;
    }
    this.records.set(recordId, record);
    return record;
  }
}
