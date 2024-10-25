import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccessLevel } from './access-level.enum';
@Schema({ timestamps: true, versionKey: false, collection: 'users' })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ enum: AccessLevel, default: AccessLevel.Read_Only })
  access_level: AccessLevel;

  @Prop({select:false})
  password: string;

  @Prop()
  refreshToken: string;

  validatePassword: Function;

  generateToken: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);
