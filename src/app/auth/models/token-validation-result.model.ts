import { User } from 'src/app/shared/models/user';

export class TokenValidationResult {
    tokenIsValid: boolean;
    loginContext: User;
}