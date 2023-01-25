import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { ValidatorsExtension } from "src/app/core/extensions";
import { MapOptions, Tag } from "src/app/core/presentation/components";
import { ApiServiceResult } from "src/app/core/presentation/services/api-base.service";
import { DialogService } from "src/app/core/presentation/services/dialog.service";
import { HomeService } from "../../services/home.service";

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: [ './home-page.component.scss' ] 
})
export class HomePageComponent implements OnInit {

    public form: FormGroup;
    public mapOptions: MapOptions;
    public foodTags: string[] = [];
    public apiError: string = '';

    private selectedFoodTags: string[] = [];

    constructor(
        private fb: FormBuilder,
        private homeService: HomeService,
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

    public sendAsist(): void {
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
            false
        ).subscribe((s) => {
            if (!s.status) {
                this.dialogService.confirm('Ups!', s.content, 'Aceptar', () => {
                    
                });
            }
        });
    }

    private initForm(): void {
        this.form = this.fb.group({
            firstName: new FormControl('', [ Validators.required ]),
            lastName: new FormControl('', [ Validators.required ]),
            phone: new FormControl('', [ ValidatorsExtension.phone ]),
            dni: new FormControl('', [ Validators.required, ValidatorsExtension.dni ]),
            foodTags: new FormControl(''),
            bus: new FormControl(false),
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
    
    private sendImpl(override: boolean): Observable<ApiServiceResult> {
        return this.homeService.sendAsist(
            this.form.controls['firstName'].value,
            this.form.controls['lastName'].value,
            this.form.controls['dni'].value,
            this.form.controls['foodTags'].value,
            this.form.controls['bus'].value,
            this.form.controls['phone'].value,
            override
        );
    }

}