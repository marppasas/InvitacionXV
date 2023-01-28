import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/core/presentation/services/dialog.service';
import { environment } from 'src/environments/environment';
import { DownloadService } from '../../services';

@Component({
    selector: 'app-download-page',
    templateUrl: './download-page.component.html',
    styleUrls: [ './download-page.component.scss' ]
})
export class DownloadPageComponent implements OnInit {
    
    public form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogService: DialogService,
        private downloadService: DownloadService,
    ) {}

    public ngOnInit(): void {
        this.initForm();
    }
    
    public download(): void {
        const input: string = this.form.controls['passcode'].value.toString();
        this.downloadService.getAllAsist(input).subscribe(r => {
            if (r.status) {
                if (r.content.length) {
                    const columns = Object.keys(r.content[0]);
                    const csv: any[][] = [columns];
                    for (let row of r.content) {
                        const c = Object.values(row);
                        csv.push(c);
                    }

                    this.downloadImpl(csv.map(e => e.join(",")).join("\n"));
                }
            }
        });
    }

    private initForm(): void {
        this.form = this.fb.group({
            passcode: new FormControl('', [ Validators.required ]),
        });
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