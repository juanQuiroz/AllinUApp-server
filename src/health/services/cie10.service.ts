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
}
