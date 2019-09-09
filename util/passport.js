import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../model/user';
import 'dotenv/config';
import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

export default passport => {
  // Jwt strategy
  // Used to verify the user
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: req => req.cookies.jwt,
        secretOrKey: process.env.SECRET
      },
      (jwtPayload, done) => {
        logger.info('jwt auth begin');
        if (Date.now() > jwtPayload.expires) {
          return done('jwt expired');
        }
        return done(null, jwtPayload);
      }
    )
  );

  // Local Strategy
  // Used to login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (passwordsMatch) {
          return done(null, user);
        }
        return done('Incorrect Username or Password');
      } catch (error) {
        return done(error);
      }
    })
  );
};