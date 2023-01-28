import { Injectable } from "@angular/core";
import { ApiBaseService } from "src/app/core/presentation/services/api-base.service";

@Injectable()
export class AsistProxyService extends ApiBaseService {

    override controller: string = 'Asist';

    readonly sendAsist = (firstName: string, lastName: string, dni: string, foodTags: string, useBus: boolean, phone: string, override: boolean) =>
        this.callPost('SendAsist', { firstName, lastName, dni, foodTags, useBus, phone, override });
    
    readonly getAllAsist = (passcode: string) => this.callGet('GetAllAsist', { passcode });

}