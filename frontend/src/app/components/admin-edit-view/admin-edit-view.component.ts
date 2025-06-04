import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FundService, Fund } from '../../services/fund.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-edit-view',
  templateUrl: './admin-edit-view.component.html',
  styleUrls: ['./admin-edit-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class AdminEditViewComponent implements OnInit, OnDestroy {
  editForm!: FormGroup;
  originalFund: Fund | null = null;
  loading = true;
  saving = false;
  error = false;
  
  private destroy$ = new Subject<void>();
  
  availableStrategies = [
    'Venture Capital', 'Hedge Fund', 'Private Equity', 'Real Estate',
    'Infrastructure', 'Distressed Assets', 'Growth Equity', 'Buyout',
    'Mezzanine', 'Private Debt'
  ];
  
  availableGeographies = [
    'Global', 'North America', 'Europe', 'Asia', 'South America',
    'Africa', 'Middle East', 'Oceania'
  ];
  
  availableCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private fundService: FundService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const fundName = decodeURIComponent(params['name']);
      if (fundName) {
        this.loadFund(fundName);
      }
    });
    
    this.setupAutoSave();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      strategies: [[], Validators.required],
      geographies: [[], Validators.required],
      currency: ['', Validators.required],
      fundSize: [0, [Validators.required, Validators.min(0)]],
      vintage: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(2050)]],
      managers: [[], Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadFund(name: string): void {
    this.loading = true;
    this.error = false;
    
    this.fundService.getFundByName(name).subscribe({
      next: (data) => {
        this.originalFund = data;
        this.populateForm(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading fund:', error);
        this.error = true;
        this.loading = false;
        this.snackBar.open('Error loading fund data', 'Close', { duration: 3000 });
      }
    });
  }

  populateForm(fund: Fund): void {
    this.editForm.patchValue({
      name: fund.name,
      strategies: fund.strategies,
      geographies: fund.geographies,
      currency: fund.currency,
      fundSize: fund.fundSize,
      vintage: fund.vintage,
      managers: fund.managers,
      description: fund.description
    });
  }

  setupAutoSave(): void {
    this.editForm.valueChanges
      .pipe(
        debounceTime(2000), // Wait 2 seconds after user stops typing
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.editForm.valid && !this.loading && this.originalFund) {
          this.autoSave();
        }
      });
  }

  autoSave(): void {
    if (this.saving || !this.originalFund) return;
    
    this.saving = true;
    const formValue = this.prepareFormData();
    
    console.log('Auto-saving fund with original name:', this.originalFund.name);
    console.log('Form data:', formValue);
    
    this.fundService.updateFund(this.originalFund.name, formValue).subscribe({
      next: (updatedFund) => {
        this.saving = false;
        this.snackBar.open('✓ Changes saved automatically', 'Close', { 
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        // Update original fund name if it was changed
        if (formValue.name !== this.originalFund?.name) {
          this.originalFund = updatedFund;
        }
      },
      error: (error) => {
        this.saving = false;
        console.error('Auto-save error:', error);
        console.error('Tried to update fund with name:', this.originalFund?.name);
        this.snackBar.open('Auto-save failed - ' + (error.error?.error || 'Unknown error'), 'Close', { 
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  manualSave(): void {
    if (this.editForm.invalid || !this.originalFund) {
      this.markFormGroupTouched();
      this.snackBar.open('Please fix form errors before saving', 'Close', { duration: 3000 });
      return;
    }

    this.saving = true;
    const formValue = this.prepareFormData();
    
    console.log('Manual saving fund with original name:', this.originalFund.name);
    console.log('Form data:', formValue);
    
    this.fundService.updateFund(this.originalFund.name, formValue).subscribe({
      next: (updatedFund) => {
        this.saving = false;
        this.snackBar.open('✓ Fund updated successfully!', 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        // Update the original fund reference for future auto-saves
        this.originalFund = updatedFund;
      },
      error: (error) => {
        this.saving = false;
        console.error('Save error:', error);
        console.error('Tried to update fund with name:', this.originalFund?.name);
        console.error('Available funds might be:', error);
        this.snackBar.open('Failed to save - ' + (error.error?.error || 'Unknown error'), 'Close', { 
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  prepareFormData(): Fund {
    const formValue = this.editForm.value;
    return {
      name: formValue.name,
      strategies: Array.isArray(formValue.strategies) ? formValue.strategies : [],
      geographies: Array.isArray(formValue.geographies) ? formValue.geographies : [],
      currency: formValue.currency,
      fundSize: Number(formValue.fundSize),
      vintage: Number(formValue.vintage),
      managers: Array.isArray(formValue.managers) ? formValue.managers : [],
      description: formValue.description
    };
  }

  deleteFund(): void {
    if (!this.originalFund) return;

    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: { fundName: this.originalFund.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.originalFund) {
        this.fundService.deleteFund(this.originalFund.name).subscribe({
          next: () => {
            this.snackBar.open('✓ Fund deleted successfully', 'Close', { 
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Delete error:', error);
            this.snackBar.open('Failed to delete - ' + (error.error?.error || 'Unknown error'), 'Close', { 
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  viewFund(): void {
    if (this.originalFund) {
      this.router.navigate(['/fund', this.originalFund.name]);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.editForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${fieldName} must be at least ${minLength} characters`;
    }
    if (control?.hasError('min')) {
      return `${fieldName} must be greater than 0`;
    }
    return '';
  }

  onManagersBlur(event: any): void {
    const value = event.target.value;
    const managersArray = value.split(',').map((m: string) => m.trim()).filter((m: string) => m);
    this.editForm.patchValue({ managers: managersArray });
  }

  getManagersDisplayValue(): string {
    const managers = this.editForm.get('managers')?.value;
    return Array.isArray(managers) ? managers.join(', ') : '';
  }
}

// Delete Confirmation Dialog Component
@Component({
  selector: 'app-delete-confirm-dialog',
  template: `
    <h1 mat-dialog-title>Delete Fund</h1>
    <div mat-dialog-content>
      <p>Are you sure you want to delete <strong>{{data.fundName}}</strong>?</p>
      <p class="warning">This action cannot be undone.</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
    </div>
  `,
  styles: [`
    .warning { color: #f44336; font-weight: 500; }
    [mat-dialog-actions] { margin-top: 16px; }
  `],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class DeleteConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { fundName: string }
  ) {}
} 