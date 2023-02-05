import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldsetComponent } from 'src/app/core/presentation/components';
import { DialogService } from 'src/app/core/presentation/services/dialog.service';
import { environment } from 'src/environments/environment';
import { DownloadService } from '../../services';

@Component({
    selector: 'app-download-page',
    templateUrl: './download-page.component.html',
    styleUrls: [ './download-page.component.scss' ]
})
export class DownloadPageComponent implements OnInit {
    
    @ViewChild('downloadInput')
    private downloadInput: FieldsetComponent;

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
                if (this.downloadService.download(r.content)) {
                    this.dialogService.confirm('Archivo descargado', 'Has descargado el archivo con la información de los invitados.');
                } else {
                    this.dialogService.confirm('¡Ups!', 'Aún no hay invitados confirmados en la página.');
                }
            } else {
                this.downloadInput.manuallySetErrorMessage(r.content.code == 401 ? 'La contraseña es incorrecta.' : 'Ha ocurrido un error inesperado.');
            }
        });
    }

    private initForm(): void {
        this.form = this.fb.group({
            passcode: new FormControl('', [ Validators.required ]),
        });
    }

}