import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './app.component';
import { AdminDataTableComponent } from './components/admin-data-table/admin-data-table.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminDataTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule.forRoot([
      { path: '', component: AdminDataTableComponent },
    //   { path: 'index', redirectTo: '', pathMatch: 'full' },
      { path: 'fund/:name', component: AdminDataTableComponent }, // We'll create this component next
      { path: 'admin/edit/:name', component: AdminDataTableComponent }, // We'll create this component next
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 