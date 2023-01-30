import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { ValidatorsExtension } from "src/app/core/extensions";
import { MapOptions, Tag } from "src/app/core/presentation/components";
import { ApiServiceResult } from "src/app/core/presentation/services/api-base.service";
import { DialogService } from "src/app/core/presentation/services/dialog.service";
import { BrunaXVService } from "../../services/brunaxv.service";

@Component({
    selector: 'app-brunaxv-page',
    templateUrl: './brunaxv-page.component.html',
    styleUrls: [ './brunaxv-page.component.scss' ] 
})
export class BrunaXVPageComponent implements OnInit {

    public form: FormGroup;
    public mapOptions: MapOptions;
    public foodTags: string[] = [];
    public apiError: string = '';

    private selectedFoodTags: string[] = [];

    constructor(
        private fb: FormBuilder,
        private homeService: BrunaXVService,
        private dialogService: DialogService,
    ) {}

    public ngOnInit(): void {
        this.mapOptions = {
            center: { lat: -55.9692058, lng: -34.8138737 },
            zoom: 16,
            marker: [
                { lat: -55.9692058, lng: -34.8138737 }
            ]
        };

        this.initForm();
        this.initTags();
    }

    public onTagClicked(tag: Tag): void {
        let idx = this.selectedFoodTags.indexOf(tag.displayText.toLowerCase());
        if (idx > -1) {
            this.selectedFoodTags.splice(idx, 1);
        } else {
            this.selectedFoodTags.push(tag.displayText.toLowerCase());
        }
        this.form.controls['foodTags'].patchValue(this.capitalize(this.selectedFoodTags.join(', ')));
    }

    public sendAsist(override: boolean = false): void {
        if (this.form.invalid) {
            return;
        }

        this.homeService.sendAsist(
            this.form.controls['firstName'].value,
            this.form.controls['lastName'].value,
            this.form.controls['dni'].value,
            this.form.controls['foodTags'].value,
            this.form.controls['bus'].value,
            this.form.controls['phone'].value,
            override
        ).subscribe((s) => {
            if (!s.status) {
                let msg: string;
                let dniConfirmed: boolean = false;
                if (typeof s.content == 'string') {
                    msg = s.content;
                } else {
                    msg = s.content.body as string;
                    dniConfirmed = s.content.code == '-6';
                    if (dniConfirmed) {
                        msg += ' ¿Querés volver a enviar los datos?';
                    }
                }
                this.dialogService.confirm('Ups!', msg, 'Aceptar', () => {
                    if (dniConfirmed) {
                        this.sendAsist(true);
                    }
                });
            } else {
                this.dialogService.confirm('Muchas gracias!', 'Tu asistencia fue confirmada.', 'Aceptar', () => { });
            }
        });
    }

    public dniValidation(s: string): string {
        if (![7,8].includes(s.length)) {
            return s;
        }
        
        let dni = s.replace(/(\.|\-)/g, '');
        if (s.length == 8) {
            dni = `${dni.substring(0, 1)}.${dni.substring(1, 4)}.${dni.substring(4, 7)}-${dni.substring(7)}`;
        }

        switch (s.length) {
            case 8:
                dni = `${dni.substring(0, 1)}.${dni.substring(1, 4)}.${dni.substring(4, 7)}-${dni.substring(7)}`;
                break;
            case 7:
                dni = `${dni.substring(0, 3)}.${dni.substring(3, 6)}-${dni.substring(6)}`;
                break;
        }
        return dni;
    }

    private initForm(): void {
        this.form = this.fb.group({
            firstName: new FormControl('', [ Validators.required ]),
            lastName: new FormControl('', [ Validators.required ]),
            phone: new FormControl('', [ ValidatorsExtension.phone ]),
            dni: new FormControl('', [ Validators.required, ValidatorsExtension.dni ]),
            foodTags: new FormControl(''),
            bus: new FormControl(false),
            allowTc: new FormControl(false, [ Validators.requiredTrue ]),
        });
    }

    private initTags(): void {
        this.foodTags = [
            'Vegetariano',
            'Vegano',
            'Celíaco',
            'Diabético'
        ];
    }

    private capitalize(input: string): string {
        return input.length ? input[0].toUpperCase() + input.substring(1).toLowerCase() : '';
    }

}