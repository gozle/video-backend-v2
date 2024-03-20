import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import Sequelize from '@sequelize/core';
import { User } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
const sendEmail = require('../util/sendMail');
import * as conf from '../config.json';
import { where } from 'sequelize';
const accesOption = {
  secret: 'secret_gozle_video_premium',
  expiresIn: '30m',
};

const refreshOption = {
  secret: 'refresh_secret_gozle_video_premium',
  expiresIn: '15d',
};

const verifyOption = {
  secret: 'verify_token_here',
};

@Injectable()
export class AuthService {
  constructor(
    // private readonly userService: User
    private jwtService: JwtService,
  ) {}
  /////////////////////////////////////////////////////////
  //  Regist
  /////////////////////////////////////////////////////////
  async createUser(data: User, file: string) {
    try {
      const hashed = await bcrypt.hash(data.password, 12);

      let us = await User.findOne({ where: { email: data.email } });

      if (us) {
        const payload1 = { id: us.id, email: us.email };
        const emailToken = await this.jwtService.signAsync(
          payload1,
          verifyOption,
        );

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
        return { message: 'Succesfully sent link to E-mail address!' };
      }

      const telNumber = data.tel || null;
      const user = await User.create({
        username: data.username,
        email: data.email,
        password: hashed,
        tel_number: telNumber,
        avatar: file,
        isVerify: false,
      });
      const payload1 = { id: user.id, email: data.email };
      const emailToken = await this.jwtService.signAsync(
        payload1,
        verifyOption,
      );

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
      // const payload = { id: user.id, username: user.username };
      // const acces_token = await this.jwtService.signAsync(payload, accesOption);
      // const refresh_token = await this.jwtService.signAsync(
      //   payload,
      //   refreshOption,
      // );

      return { message: 'Succesfully sent link to E-mail address!' };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  /////////////////////////////////////////////////////////
  //  Login
  /////////////////////////////////////////////////////////

  async login(data: LoginDto) {
    const user = await User.findOne({
      where: { email: data.email, isVerify: true },
    });
    if (!user) {
      throw new UnauthorizedException({
        message: 'Please sign up or verify your account',
      });
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, username: user.username };
    const acces_token = await this.jwtService.signAsync(payload, accesOption);
    const refresh_token = await this.jwtService.signAsync(
      payload,
      refreshOption,
    );
    return { acces_token, refresh_token };
  }
  /////////////////////////////////////////////////////////
  //  Renew access_token
  /////////////////////////////////////////////////////////
  async reNewToken(data: any) {
    try {
      const payload = { id: data.id, username: data.username };
      const acces_token = await this.jwtService.signAsync(payload, accesOption);
      return { acces_token };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  /////////////////////////////////////////////////////////
  //  Verify email
  /////////////////////////////////////////////////////////

  async fgetVerify(token: string) {
    try {
      console.log(token);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: verifyOption.secret,
      });

      const user = await User.findByPk(payload.id);
      if (!user) {
        throw new NotFoundException();
      }

      await user.update({ isVerify: true });

      return { url: 'gozle.video.app://outh2redirect', statusCode: 301 };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
