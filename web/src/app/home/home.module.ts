import { NgModule } from "@angular/core";
import { HomeRoutingModule } from "./home-routing.module";
import { PresentationModule } from "./presentation/presentation.module";

@NgModule({
    imports: [
        HomeRoutingModule,
        PresentationModule,
    ]
})
export class HomeModule {}