import { Schema } from 'mongoose';
import { User } from 'src/user/user.schema';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

const SALT_ROUNDS = 10;
interface UserUpdate {
  password?: string; // Include other fields if needed
}

export const authPlugin = (schema: Schema) => {
  const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
  };

  schema.pre('save', function (next) {
    if (this.isModified('password')) {
      this.password = hashPassword(this.password);
    }
    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate() as UserUpdate;
    if (update.password) {
      update.password = hashPassword(update.password);
    }
    next();
  });

  schema.methods.validatePassword = async function (password: string) {
    const valid = await bcrypt.compare(password, this.password);

    if(!valid)throw new UnauthorizedException('Invalid password');
    
    return valid;
  };

  schema.methods.generateToken = async function () {
    const payload = { id: this._id };
    const accessTokenSecret = process.env.JWT_SECRET;
    const accessTokenexpiresIn = process.env.JWT_EXPIRESIN;

    if (
      !accessTokenSecret ||
      !accessTokenexpiresIn 
    ) {
      throw new Error('JWT secrets are not set in environment variables');
    }

    const access_token = await jwt.sign(payload, accessTokenSecret, {
      expiresIn: accessTokenexpiresIn,
    });
    const refresh_token = crypto.randomBytes(64).toString('hex');

    return {
      access_token,
      refresh_token,
    };
  };
};