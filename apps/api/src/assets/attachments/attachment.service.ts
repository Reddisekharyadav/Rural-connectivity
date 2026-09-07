import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetService } from '../assets/asset.service';

export type AttachmentType =
  | 'ROTAVATOR'
  | 'CULTIVATOR'
  | 'PLOUGH'
  | 'SEED_DRILL'
  | 'TRAILER'
  | 'LEVELLER'
  | 'HARROW'
  | 'THRESHER'
  | 'SPRAYER'
  | 'OTHER';

export interface CreateAttachmentDto {
  attachmentAssetId?: string;
  attachmentType: AttachmentType;
  compatible?: boolean;
  notes?: string;
}

@Injectable()
export class AssetAttachmentService {
  private attachments = new Map<string, any[]>();

  constructor(private readonly assetService: AssetService) {}

  async addAttachment(assetId: string, dto: CreateAttachmentDto): Promise<any> {
    const asset = await this.assetService.getAssetById(assetId);
    const id = `att-${Date.now()}`;
    const newAtt = {
      id,
      assetId,
      attachmentAssetId: dto.attachmentAssetId,
      attachmentType: dto.attachmentType,
      compatible: dto.compatible ?? true,
      notes: dto.notes,
      createdAt: new Date(),
    };

    const currentAtts = this.attachments.get(assetId) || asset.attachments || [];
    currentAtts.push(newAtt);
    this.attachments.set(assetId, currentAtts);
    asset.attachments = currentAtts;

    return newAtt;
  }

  async getAttachments(assetId: string): Promise<any[]> {
    const asset = await this.assetService.getAssetById(assetId);
    return this.attachments.get(assetId) || asset.attachments || [];
  }

  async deleteAttachment(assetId: string, attachmentId: string): Promise<{ success: boolean; deletedId: string }> {
    const atts = await this.getAttachments(assetId);
    const index = atts.findIndex((a) => a.id === attachmentId);
    if (index === -1) throw new NotFoundException(`Attachment '${attachmentId}' not found`);

    atts.splice(index, 1);
    this.attachments.set(assetId, atts);
    return { success: true, deletedId: attachmentId };
  }
}

