import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    { path: 'brunaxv', loadChildren: () => import('./brunaxv/brunaxv.module').then(t => t.BrunaXVModule) },
    { path: 'download', loadChildren: () => import('./download/download.module').then(t => t.DownloadModule) },
    { path: '**', redirectTo: 'brunaxv' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}