import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FundService, Fund } from '../../services/fund.service';

@Component({
  selector: 'app-user-facing-data-view',
  templateUrl: './user-facing-data-view.component.html',
  styleUrls: ['./user-facing-data-view.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule]
})
export class UserFacingDataViewComponent implements OnInit {
  fund: Fund | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fundService: FundService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const fundName = params['name'];
      if (fundName) {
        this.loadFund(fundName);
      }
    });
  }

  loadFund(name: string): void {
    this.loading = true;
    this.error = false;
    
    this.fundService.getFundByName(name).subscribe({
      next: (data) => {
        this.fund = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading fund:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  editFund(): void {
    if (this.fund) {
      this.router.navigate(['/admin/edit', this.fund.name]);
    }
  }
} 