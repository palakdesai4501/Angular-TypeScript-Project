import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { AdminDataTableComponent } from './components/admin-data-table/admin-data-table.component';

export const routes: Routes = [
    { path: '', component: AdminDataTableComponent },
    { path: 'index', component: IndexComponent},
    { path: 'fund/:name', component: AdminDataTableComponent },
    { path: 'admin/edit/:name', component: AdminDataTableComponent },
    { path: '**', redirectTo: ''}
];
