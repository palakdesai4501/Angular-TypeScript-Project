import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { AdminDataTableComponent } from './components/admin-data-table/admin-data-table.component';
import { UserFacingDataViewComponent } from './components/user-facing-data-view/user-facing-data-view.component';
import { AdminEditViewComponent } from './components/admin-edit-view/admin-edit-view.component';

export const routes: Routes = [
    { path: '', component: AdminDataTableComponent },
    { path: 'index', component: IndexComponent},
    { path: 'fund/:name', component: UserFacingDataViewComponent },
    { path: 'admin/edit/:name', component: AdminEditViewComponent },
    { path: '**', redirectTo: ''}
];
