import { Injectable } from "@angular/core";
import { AsistProxyService } from "src/app/api-proxy/services/asist.proxy.service";

@Injectable()
export class DownloadService {

    constructor(
        private asistProxy: AsistProxyService,
    ) {}

    public getAllAsist = this.asistProxy.getAllAsist;

}