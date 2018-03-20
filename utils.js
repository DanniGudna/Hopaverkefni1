const passport = require('passport');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

if (!process.env.CLOUDINARY_NAME ||
   !process.env.CLOUDINARY_APIKEY || !process.env.CLOUDINARY_APISECRET) {
  console.warn('Missing cloudinary config, uploading images will not work');
}


function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

function requireAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => { // eslint-disable-line
      if (err) {
        return next(err);
      }

      if (!user) {
        const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
        return res.status(401).json({ error });
      }

      req.user = user;
      next();
    },
  )(req, res, next);
}

module.exports = {
  catchErrors,
  ensureLoggedIn,
  requireAuthentication,
  passport,
  cloudinary,
};
