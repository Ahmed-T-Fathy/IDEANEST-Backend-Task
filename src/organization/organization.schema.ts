import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class Organization extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({
    type: [
      {
        user_id: { type: Types.ObjectId, ref: User.name, required: true },
        access_level: {
          type: String,
          enum: ['Admin', 'Read-Only'],
          default: 'Read-Only',
        },
      },
    ],
    default: [],
  })
  organization_members: string[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
