import { IsEmail, IsNotEmpty } from "class-validator";

export class InviteUserToOrganizationDTO{
    @IsNotEmpty()
    @IsEmail()
    user_email:string;
}