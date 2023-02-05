import { Injectable } from "@angular/core";
import { AsistProxyService } from "src/app/api-proxy/services/asist.proxy.service";

@Injectable()
export class DownloadService {

    constructor(
        private asistProxy: AsistProxyService,
    ) {}

    public getAllAsist = this.asistProxy.getAllAsist;

    public download(arr: string[][]): boolean {
        if (arr.length == 0) return false;

        const columns = Object.keys(arr[0]);
        const csv: any[][] = [columns];
        for (let row of arr) {
            const c = Object
                .values(row)
                .map(e => e.includes(',') ? `"${e}"` : e);
            csv.push(c);
        }

        this.downloadImpl(csv.map(e => e.join(",")).join("\n"));

        return true;
    }

    private downloadImpl(str: string): void {
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(str);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute("href", dataStr);
        a.setAttribute("download", "invitados.csv");
        a.click();
        a.remove();
    }

}