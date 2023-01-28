import { NgModule } from "@angular/core";
import { DownloadRoutingModule } from "./download-routing.module";
import { PresentationModule } from "./presentation/presentation.module";

@NgModule({
    imports: [
        DownloadRoutingModule,
        PresentationModule,
    ]
})
export class DownloadModule {}