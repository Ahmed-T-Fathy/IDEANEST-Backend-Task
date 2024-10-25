import { IsNotEmpty, IsString } from "class-validator";

export class MongooseIdDTO {
    @IsNotEmpty()
    @IsString()
    id:string
}
