import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ApiProxyModule } from "../api-proxy/api-proxy.module";
import { PresentationModule } from "./presentation/presentation.module";

@NgModule({
    imports: [
        PresentationModule,
        ApiProxyModule,
        HttpClientModule,
    ],
    exports: [
        PresentationModule,
        ApiProxyModule,
        HttpClientModule,
    ]
})
export class CoreModule {}