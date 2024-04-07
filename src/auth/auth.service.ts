import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
const sendEmail = require('../util/sendMail');
import * as conf from '../config/config.json';
import * as dotenv from 'dotenv';
import { Op } from 'sequelize';
import { Language } from 'src/models/language.model';

dotenv.config();

const access_secret = process.env.ACCESS_SECRET || conf.accessSecret;
const refrsh_secret = process.env.REFRESH_SECRET || conf.refreshSecret;
const verify_secret = process.env.EMAIL_VER_SECRET;

const accesOption = {
  secret: access_secret,
  expiresIn: '1h',
};
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const refreshOption = {
  secret: refrsh_secret,
  expiresIn: '15d',
};

const verifyOption = {
  secret: verify_secret,
};

@Injectable()
export class AuthService {
  constructor(
    // private readonly userService: User
    private jwtService: JwtService,
  ) {}

  /////////////////////////////////////////////////////////
  //Get User Information for main page or other pages
  /////////////////////////////////////////////////////////

  async getUserInfo(payload: { id: number; username: string }) {
    const user = await User.findByPk(payload.id, {
      attributes: ['username', 'avatar'],
    });
    const languages = await Language.findAll({
      attributes: [['shortName', 'name']],
    });
    return { languages, user };
  }

  /////////////////////////////////////////////////////////
  //  Register
  /////////////////////////////////////////////////////////
  async createUser(data: User, file: string) {
    try {
      const hashed = await bcrypt.hash(data.password, 12);

      let us = await User.findOne({
        where: {
          [Op.or]: [{ email: data.email }, { username: data.username }],
        },
      });

      let hasError = { err: false, msg: '' };

      if (us && us.username == data.username) {
        hasError.err = true;
        hasError.msg = 'This username already exists. Please try another one!';
      }

      if (us && us.email == data.email) {
        if (!us.isVerify) {
          const payload1 = { id: us.id, email: us.email };
          const emailToken = await this.jwtService.signAsync(
            payload1,
            verifyOption,
          );
          const hasSent = myCache.get(`${us.email}`);

          if (!hasSent) {
            let mailText = `<h1> Salam! 🖐🏻</h1>
            </br>
            </br>
            <h3>Gözle wideo E-mail adresiňizi tassyklamak üçin aşakdaky baglanyşygy ulanmagyňyzy haýyş edýäris!</h3>
            </br>
            <h3>Eger bu saýtda registrasiýa etmedik bolsaňyz, bu habary äsgermezlik ediň ýa-da pozuň.!</h3>
            </br>
            </br>
            <a href="${conf.url}/api/auth/verify/email/${emailToken}">${conf.url}/api/auth/verify/email/${emailToken}</a>
            Registrasiýaňyz üçin sag boluň!
            </br>
            Gözle topary!
            `;
            myCache.set(`${us.email}`, true, 300);
            let send = await sendEmail.sendEmailMessage(data.email, mailText);
          }
          hasError.err = true;
          hasError.msg =
            'This e-mail address already exists or not verified. Please try another one or verify it!';
        } else {
          hasError.err = true;
          hasError.msg =
            'This e-mail address already exists. Please try another one or Log in';
        }
      }
      if (hasError.err) {
        throw new ConflictException(hasError.msg);
      }

      const user = await User.create({
        username: data.username,
        email: data.email,
        password: hashed,

        avatar: file,
        isVerify: false,
      });
      const payload1 = { id: user.id, email: data.email };
      const emailToken = await this.jwtService.signAsync(
        payload1,
        verifyOption,
      );
      const hasSent = myCache.get(`${user.email}`);

      if (!hasSent) {
        myCache.set(`${user.email}`, true);
        let mailText = `<h1> Salam! 🖐🏻</h1>
      </br>
      </br>
      <h3>Gözle wideo E-mail adresiňizi tassyklamak üçin aşakdaky baglanyşygy ulanmagyňyzy haýyş edýäris!</h3>
      </br>
      <h3>Eger bu saýtda registrasiýa etmedik bolsaňyz, bu habary äsgermezlik ediň ýa-da pozuň.!</h3>
      </br>
      </br>
      <a href="${conf.url}/api/auth/verify/email/${emailToken}">${conf.url}/api/auth/verify/email/${emailToken}</a>
      Registrasiýaňyz üçin sag boluň!
      </br>
      Gözle topary!
      `;
        await sendEmail.sendEmailMessage(data.email, mailText);
      }
      // const payload = { id: user.id, username: user.username };
      // const acces_token = await this.jwtService.signAsync(payload, accesOption);
      // const refresh_token = await this.jwtService.signAsync(
      //   payload,
      //   refreshOption,
      // );

      return { message: 'Succesfully sent link to E-mail address!' };
    } catch (err) {
      throw err;
    }
  }

  /////////////////////////////////////////////////////////
  //  Login
  /////////////////////////////////////////////////////////

  async login(data: LoginDto) {
    const user = await User.findOne({
      where: { email: data.email }, //, isVerify: true
    });
    if (!user.isVerify) {
      const payload1 = { id: user.id, email: user.email };
      const emailToken = await this.jwtService.signAsync(
        payload1,
        verifyOption,
      );
      const hasSent = myCache.get(`${user.email}`);

      if (!hasSent) {
        myCache.set(`${user.email}`, true);
        let mailText = `<h1> Salam! 🖐🏻</h1>
      </br>
      </br>
      <h3>Gözle wideo E-mail adresiňizi tassyklamak üçin aşakdaky baglanyşygy ulanmagyňyzy haýyş edýäris!</h3>
      </br>
      <h3>Eger bu saýtda registrasiýa etmedik bolsaňyz, bu habary äsgermezlik ediň ýa-da pozuň.!</h3>
      </br>
      </br>
      <a href="${conf.url}/api/auth/verify/email/${emailToken}">${conf.url}/api/auth/verify/email/${emailToken}</a>
      Registrasiýaňyz üçin sag boluň!
      </br>
      Gözle topary!
      `;
        let send = await sendEmail.sendEmailMessage(data.email, mailText);
      }
      throw new ForbiddenException({
        message: 'Please sign up or check your e-post if already signed up!',
      });
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, username: user.username };
    const access_token = await this.jwtService.signAsync(payload, accesOption);
    const refresh_token = await this.jwtService.signAsync(
      payload,
      refreshOption,
    );
    return { access_token, refresh_token };
  }
  /////////////////////////////////////////////////////////
  //  Renew access_token
  /////////////////////////////////////////////////////////
  async reNewToken(data: any) {
    try {
      const payload = { id: data.id, username: data.username };
      const user = await User.findByPk(data.id);
      if (!user) {
        throw new UnauthorizedException();
      }
      const access_token = await this.jwtService.signAsync(
        payload,
        accesOption,
      );
      const refresh_token = await this.jwtService.signAsync(
        payload,
        refreshOption,
      );
      return { access_token, refresh_token };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  /////////////////////////////////////////////////////////
  //  Verify email
  /////////////////////////////////////////////////////////

  async fgetVerify(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: verifyOption.secret,
      });

      const user = await User.findByPk(payload.id);
      if (!user) {
        throw new ForbiddenException();
      }
      await user.update({ isVerify: true });
      myCache.take(`${user.email}`, true);

      return { url: 'gozle.video.app://outh2redirect', statusCode: 301 };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
