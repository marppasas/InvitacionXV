import { Injectable } from "@angular/core";
import { AsistProxyService } from "src/app/api-proxy/services/asist.proxy.service";

@Injectable()
export class HomeService {

    constructor(
        private asistProxyService: AsistProxyService,
    ) {}

    public readonly sendAsist = this.asistProxyService.sendAsist;

}