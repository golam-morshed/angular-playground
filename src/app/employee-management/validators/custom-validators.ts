import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  
  /**
   * Validator for phone number length
   * Accepts phone numbers between 10-15 characters
   */
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const phoneValue = control.value.toString().trim();
      const length = phoneValue.length;

      if (length < 10 || length > 15) {
        return { phoneLength: { min: 10, max: 15, actual: length } };
      }

      return null;
    };
  }
}

