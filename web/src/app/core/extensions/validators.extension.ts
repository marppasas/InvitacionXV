import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export class ValidatorsExtension extends Validators {

    static phone(control: AbstractControl): ValidationErrors | null {
        const regExp = new RegExp('^09[0-9]{7}$');
        return control.value.length && !regExp.test(control.value) ? { 'invalid': 'Número de teléfono inválido.' } : null;
    }

    static dni(control: AbstractControl): ValidationErrors | null {
        let aux = (control.value as string).replace(/(\.|\-)/g, '');
        return aux.length && (Number.isNaN(Number(aux)) || aux.startsWith('0') || ![ 7, 8 ].includes(aux.length)) ? { 'invalid': 'Número de cédula inválida.' } : null;
    }

}