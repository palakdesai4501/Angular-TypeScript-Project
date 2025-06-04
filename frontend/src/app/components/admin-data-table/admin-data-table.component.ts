import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FundService, Fund } from '../../services/fund.service';

@Component({
  selector: 'app-admin-data-table',
  templateUrl: './admin-data-table.component.html',
  styleUrls: ['./admin-data-table.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule]
})
export class AdminDataTableComponent implements OnInit {
  funds: Fund[] = [];
  displayedColumns: string[] = ['name', 'strategies', 'geographies', 'currency', 'fundSize', 'vintage', 'managers', 'actions'];

  constructor(
    private fundService: FundService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFunds();
  }

  loadFunds(): void {
    this.fundService.getAllFunds().subscribe({
      next: (data) => {
        this.funds = data;
      },
      error: (error) => {
        console.error('Error loading funds:', error);
      }
    });
  }

  onViewFund(name: string): void {
    this.router.navigate(['/fund', name]);
  }

  onEditFund(name: string): void {
    this.router.navigate(['/admin/edit', name]);
  }
} 