import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DateValidator {
  static startDateValid(control: AbstractControl): ValidationErrors | null {
    const startDate = new Date(control.value);
    const today = new Date();

    if (startDate < today) {
      return { startDateInvalid: true }; // Return validation error if start date is in the past
    }

    return null; // Return null if validation passes
  }

  static endDateValid(control: AbstractControl): ValidationErrors | null {
    const endDate = new Date(control.value);
    const startDate = new Date(control.root!.get('startDate')!.value); // Use non-null assertion operator (!)

    if (endDate <= startDate) {
      return { endDateInvalid: true }; // Return validation error if end date is before or equal to start date
    }

    return null; // Return null if validation passes
  }
}
