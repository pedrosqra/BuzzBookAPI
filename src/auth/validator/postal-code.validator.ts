import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({
  name: 'isPostalCodeBR',
  async: false
})
class IsPostalCodeBRConstraint
  implements ValidatorConstraintInterface
{
  validate(postalCode: any) {
    // Regex para validar o formato de CEP brasileiro (XXXXX-XXX)
    const postalCodeRegex = /^[0-9]{5}-[0-9]{3}$/;

    return postalCodeRegex.test(postalCode);
  }

  defaultMessage() {
    return 'Postal code must be in Brazilian format (XXXXX-XXX).';
  }
}

export function IsPostalCodeBR(
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
      validator: IsPostalCodeBRConstraint
    });
    ApiProperty({
      description:
        'Postal code (Brazilian format: XXXXX-XXX)'
    })(object, propertyName);
  };
}
