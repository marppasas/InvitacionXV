import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "src/app/core/core.module";
import { BrunaXVPageComponent } from "./components";
import { BrunaXVService } from "./services/brunaxv.service";

@NgModule({
    imports: [
        CoreModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    declarations: [
        BrunaXVPageComponent,
    ],
    exports: [
        BrunaXVPageComponent,
    ],
    providers: [
        BrunaXVService,
    ]
})
export class PresentationModule {}