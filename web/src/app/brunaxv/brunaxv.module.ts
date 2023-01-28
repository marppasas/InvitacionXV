import { NgModule } from "@angular/core";
import { BrunaXVRoutingModule } from "./brunaxv-routing.module";
import { PresentationModule } from "./presentation/presentation.module";

@NgModule({
    imports: [
        BrunaXVRoutingModule,
        PresentationModule,
    ]
})
export class BrunaXVModule {}