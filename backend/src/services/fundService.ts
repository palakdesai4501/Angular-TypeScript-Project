import { Fund } from '../types';
import * as fs from 'fs';
import * as path from 'path';

const dataPath = path.join(__dirname, '../../data/funds_data.json');

export class FundService {
  private funds: Fund[];

  constructor() {
    this.funds = this.loadFunds();
  }

  private loadFunds(): Fund[] {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  }

  private saveFunds(): void {
    fs.writeFileSync(dataPath, JSON.stringify(this.funds, null, 2));
  }

  getAllFunds(): Fund[] {
    return this.funds;
  }

  getFundByName(name: string): Fund | undefined {
    return this.funds.find(fund => fund.name === name);
  }

  updateFund(name: string, updatedFund: Fund): Fund | undefined {
    const index = this.funds.findIndex(fund => fund.name === name);
    if (index !== -1) {
      this.funds[index] = updatedFund;
      this.saveFunds();
      return updatedFund;
    }
    return undefined;
  }

  deleteFund(name: string): boolean {
    const index = this.funds.findIndex(fund => fund.name === name);
    if (index !== -1) {
      this.funds.splice(index, 1);
      this.saveFunds();
      return true;
    }
    return false;
  }
} 