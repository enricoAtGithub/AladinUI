import { Component, OnInit, Input, forwardRef, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css'],
  providers:  [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() placeholder: string;
  @Input() floatLabel: string;
  @Input() minLength: number;
  @Input() maxLength: number;

  value = '';
  safetyBarColor: string;
  safetyBarWidth = '0px';
  validationFn: Function;

  constructor() { }

  ngOnInit() {
    if (!this.placeholder) {
      this.placeholder = '';
    }

    if (this.minLength === undefined) {
      this.minLength = 8;
    }

    if (this.maxLength === undefined) {
      this.maxLength = 32;
    }

    this.validationFn = this.createPasswordValidator(this.minLength, this.maxLength);
  }

  ngOnChanges(changes) {
    if (changes.minLength || changes.maxLength) {
      this.validationFn = this.createPasswordValidator(this.minLength, this.maxLength);
    }
  }

  createPasswordValidator(minLength, maxLength) {
    return function validatePassword(c: FormControl) {
      const pass: string = c.value;
      if (pass === undefined) {
        return {
          lengthError: {
            given: 0,
            min: minLength,
            max: maxLength
          }
        };
      }
      const re = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*"§\'.!@#$%^&(){}\\[\\]:;<>,.?\\/~_\\-+=|]).{' + minLength + ',' + maxLength + '}$');

      if (re.test(pass)) {
        return null;
      }

      return {
        matchError: {
          given: pass
        }
      };
    };
  }

  passwordChanged(password: string): void {
    let passwordSafety = 0;
    if (password.length >= 0) {
      passwordSafety += (password.length) * (password.length) / 3;
      if (password !== password.toLowerCase() && password !== password.toUpperCase()) {
        passwordSafety *= 1.5;
      }
      if (password.match(/\d/) !== null) {
        passwordSafety *= 1.2;
      }
      if (password.match(/[^A-Za-z0-9]/) !== null) {
        passwordSafety *= 1.3;
      }
    }

    if (passwordSafety > 100) {
      passwordSafety = 100;
    }
    this.safetyBarColor = 'hsl(' + passwordSafety * 1.2 + ', 100%, 50%)';
    this.safetyBarWidth = passwordSafety + '%';
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: FormControl) {
    return this.validationFn(c);
  }
}
