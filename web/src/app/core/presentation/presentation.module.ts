import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FadeInDirective, FieldsetComponent, IconComponent, InfoCardComponent, MapComponent, TagSelectorComponent } from "./components";
import { DialogService } from "./services/dialog.service";

const comps = [
    // Component
    FieldsetComponent,
    IconComponent,
    InfoCardComponent,
    MapComponent,
    TagSelectorComponent,

    // Directives
    FadeInDirective,
];

@NgModule({
    imports: [
        FontAwesomeModule,
        CommonModule,
        FormsModule,
    ],
    providers: [
        DialogService,
    ],
    declarations: comps,
    exports: comps,
})
export class PresentationModule {}