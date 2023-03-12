import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    { path: 'home', loadChildren: () => import('./home/home.module').then(t => t.HomeModule) },
    { path: 'download', loadChildren: () => import('./download/download.module').then(t => t.DownloadModule) },
    { path: '**', redirectTo: 'home' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}