import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AsistProxyService } from "src/app/api-proxy/services/asist.proxy.service";

@Injectable()
export class HomeService {

    constructor(
        private asistProxyService: AsistProxyService,
    ) {}

    public sendAsist(): Observable<any> {
        return new Observable(obs => {
            setTimeout(() => {
                obs.next();
            }, 500);
        });
    }

}