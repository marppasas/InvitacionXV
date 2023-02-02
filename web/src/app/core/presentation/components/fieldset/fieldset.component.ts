import { Component, ElementRef, forwardRef, Inject, Injector, INJECTOR, Input, OnInit, Output, EventEmitter, ViewChild } from "@angular/core";
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'app-fieldset',
    templateUrl: './fieldset.component.html',
    styleUrls: [ './fieldset.component.scss' ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => FieldsetComponent)
        }
    ],
})
export class FieldsetComponent implements OnInit, ControlValueAccessor {

    @Input() name: string;
    @Input() type: 'text' | 'email' | 'password' | 'phone';
    @Input() placeholder: string;
    @Input() info?: string;
    @Input() manualValidation?: (s: string) => string;

    onChange: (_: any) => void;
    onTouched: () => void = () => { };

    public labelOnTop: boolean = false;
    public errorMsg: string | null = null;
    @ViewChild('input')
    private inputElement: ElementRef;

    private _value: string = '';
    private control: NgControl;

    constructor(
        @Inject(INJECTOR) private injector: Injector
    ) { }

    public get value(): string { return this._value; }
    public set value(v: string) { this._value = v; }

    public ngOnInit(): void {
        this.control = this.injector.get(NgControl);
    }

    public onFocus(): void {
        if (!!this.inputElement) {
            this.inputElement.nativeElement.focus();
            this.labelOnTop = true;
        }

        this.errorMsg = '';
    }

    public lostFocus(): void {
        this.value = this.manualValidation != null ? this.manualValidation(this.value) : this.value;
        if (this.value.trim() == '') {
            this.labelOnTop = false;
            this.value = '';
        }

        this.validateField();
    }

    public validateField(): void {
        this.errorMsg = '';
        
        const errors = this.control.errors as { [key: string]: any };
        if (errors != null) {
            const withText = Object.values(errors).find(t => typeof t == 'string' && (t as string).length);
            if (!!withText) {
                this.errorMsg = withText
            } else if(errors.hasOwnProperty('required')) {
                this.errorMsg = 'Este campo es obligatorio.';
            } else {
                this.errorMsg = 'Este campo es inválido.';
            }
        }
    }

    public manuallySetErrorMessage(s: string): void {
        this.errorMsg = s;
    }

    registerOnChange(fn: (_: string) => void) {
        this.onChange = (inputText: string) => {
            if (this._value != inputText) {
                this._value = inputText;
                fn(inputText);
            }
        };
    }
    
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    writeValue(value: string): void {
        this._value = value;
    }

}