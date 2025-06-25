import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Cie10Service } from '../services/cie10.service';
import * as multer from 'multer';

@Controller('cie10')
export class Cie10Controller {
  constructor(private readonly cie10Service: Cie10Service) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file || !file.buffer) {
        throw new Error('No file buffer available');
      }

      await this.cie10Service.createManyFromExcel(file.buffer);
      return { message: 'File uploaded successfully' };
    } catch (error) {
      console.error('Error processing the file:', error);
      throw new Error('Error processing the file');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const cie10 = await this.cie10Service.findAll();
    return {
      message: 'Cie10 list retrieved successfully',
      data: cie10,
    };
  }

  @Get('most-frequent-diagnoses')
  @HttpCode(HttpStatus.OK)
  async findMostFrequentDiagnoses(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit) : 10;
    const diagnoses = await this.cie10Service.findMostFrequentDiagnoses(limitNumber);
    return {
      message: 'Most frequent CIE10 diagnoses retrieved successfully',
      data: diagnoses,
    };
  }
}
