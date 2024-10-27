import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types ,Schema as schema} from 'mongoose';
import { User } from '../user/user.schema';
console.log(User.name);

@Schema({ timestamps: true, versionKey: false })
export class Organization extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({
    type: [
      { type: schema.Types.ObjectId, ref: User.name, required: true }
    ],
    default: [],
  })
  organization_members: Types.ObjectId[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
