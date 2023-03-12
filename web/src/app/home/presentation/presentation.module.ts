import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "src/app/core/core.module";
import { HomePageComponent } from "./components";
import { HomeService } from "./services/home.service";

@NgModule({
    imports: [
        CoreModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    declarations: [
        HomePageComponent,
    ],
    exports: [
        HomePageComponent,
    ],
    providers: [
        HomeService,
    ]
})
export class PresentationModule {}