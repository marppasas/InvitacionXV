import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "src/app/core/core.module";
import { DownloadPageComponent } from "./components";
import { DownloadService } from "./services";

@NgModule({
    imports: [
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    declarations: [
        DownloadPageComponent,
    ],
    exports: [
        DownloadPageComponent,
    ],
    providers: [
        DownloadService,
    ]
})
export class PresentationModule {}