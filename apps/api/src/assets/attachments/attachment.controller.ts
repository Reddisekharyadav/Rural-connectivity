import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AssetAttachmentService, CreateAttachmentDto } from './attachment.service';

@Controller('assets/:assetId/attachments')
export class AssetAttachmentController {
  constructor(private readonly attachmentService: AssetAttachmentService) {}

  @Post()
  async addAttachment(@Param('assetId') assetId: string, @Body() dto: CreateAttachmentDto) {
    return this.attachmentService.addAttachment(assetId, dto);
  }

  @Get()
  async getAttachments(@Param('assetId') assetId: string) {
    return this.attachmentService.getAttachments(assetId);
  }

  @Delete(':attachmentId')
  async deleteAttachment(@Param('assetId') assetId: string, @Param('attachmentId') attachmentId: string) {
    return this.attachmentService.deleteAttachment(assetId, attachmentId);
  }
}

