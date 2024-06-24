import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({
  name: 'isStrongPassword',
  async: false
})
class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(
    password: any,
    args: ValidationArguments
  ) {
    const {
      minLength,
      minNumbers,
      minSymbols,
      minUppercase,
      minLowercase
    } = args.constraints[0];
    const numberRegex = /\d/;
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;

    const hasMinLength =
      password.length >= minLength;
    const hasMinNumbers =
      (password.match(numberRegex) || [])
        .length >= minNumbers;
    const hasMinSymbols =
      (password.match(symbolRegex) || [])
        .length >= minSymbols;
    const hasMinUppercase =
      (password.match(uppercaseRegex) || [])
        .length >= minUppercase;
    const hasMinLowercase =
      (password.match(lowercaseRegex) || [])
        .length >= minLowercase;

    return (
      hasMinLength &&
      hasMinNumbers &&
      hasMinSymbols &&
      hasMinUppercase &&
      hasMinLowercase
    );
  }

  defaultMessage(args: ValidationArguments) {
    const {
      minLength,
      minNumbers,
      minSymbols,
      minUppercase,
      minLowercase
    } = args.constraints[0];
    return `Password must be at least ${minLength} characters long, and include at least ${minNumbers} number(s), ${minSymbols} symbol(s), ${minUppercase} uppercase letter(s), and ${minLowercase} lowercase letter(s).`;
  }
}

export function IsStrongPassword(
  validationOptions?: ValidationOptions
) {
  return function (
    object: Record<string, any>,
    propertyName: string
  ) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        {
          minLength: 8,
          minNumbers: 1,
          minSymbols: 1,
          minUppercase: 1,
          minLowercase: 1
        }
      ],
      validator: IsStrongPasswordConstraint
    });
    ApiProperty({
      description:
        'User password (must be strong)'
    })(object, propertyName);
  };
}
