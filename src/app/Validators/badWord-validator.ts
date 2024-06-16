import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export class BadWordValidator {
  static validate(badWords: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Check if control value is null or undefined
      if (control.value == null) {
        return null;
      }
      
      const value: string = control.value.toLowerCase(); // Convert value to lowercase for case-insensitive check
      const hasBadWord = badWords.some(badWord => value.includes(badWord.toLowerCase())); // Check if any bad word exists in the value
      return hasBadWord ? { 'badWord': true } : null; // Return error if bad word found, else return null
    };
  }
}
