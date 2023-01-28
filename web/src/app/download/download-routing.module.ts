import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DownloadPageComponent } from "./presentation/components";

const routes: Routes = [
    { path: '', component: DownloadPageComponent },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class DownloadRoutingModule {}