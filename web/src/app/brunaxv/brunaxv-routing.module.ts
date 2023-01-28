import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrunaXVPageComponent } from "./presentation/components";

const routes: Routes = [
    { path: '', component: BrunaXVPageComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class BrunaXVRoutingModule {}