import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { DateTime } from 'luxon';
import { InjectRepository } from '@nestjs/typeorm';
import { Cie10 } from '../entities/cie10.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Cie10Service {
  constructor(
    @InjectRepository(Cie10)
    private readonly cie10Repository: Repository<Cie10>,
  ) {}

  async createManyFromExcel(fileBuffer: Buffer): Promise<Cie10[]> {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const cie10Data = XLSX.utils.sheet_to_json(worksheet);

    const cie10 = cie10Data.map((row: any) => {
      const disease = new Cie10();

      disease.code = row['code'];
      disease.description = row['description'];

      return disease;
    });

    await this.cie10Repository.save(cie10);

    return cie10;
  }

  async findAll(): Promise<Cie10[]> {
    return this.cie10Repository.find();
  }

  async findMostFrequentDiagnoses(limit: number = 10): Promise<any[]> {
    const result = await this.cie10Repository
      .createQueryBuilder('cie10')
      .leftJoin('cie10.appointmentCie10', 'appointmentCie10')
      .select([
        'cie10.id',
        'cie10.code',
        'cie10.description',
        'COUNT(appointmentCie10.id) as frequency'
      ])
      .groupBy('cie10.id')
      .addGroupBy('cie10.code')
      .addGroupBy('cie10.description')
      .orderBy('frequency', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(item => ({
      id: item.cie10_id,
      code: item.cie10_code,
      description: item.cie10_description,
      frequency: parseInt(item.frequency)
    }));
  }
}
