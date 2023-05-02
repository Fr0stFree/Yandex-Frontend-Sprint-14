const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const { SECRET_KEY, TOKEN_EXPIRATION } = require('../core/settings');
const { getObjectOrRaise404 } = require('../core/utils');
const ObjectDoesNotExist = require('../core/errors');

const get = async (req, res, next) => {
  try {
    const user = await getObjectOrRaise404(User, req.params.userId);
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = jwt.sign(
      { userId: user._id.toString() },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRATION },
    );
    return res.send({ token, type: 'Bearer' });
  } catch (err) {
    if (err instanceof ObjectDoesNotExist) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: err.message });
    }
    return next(err);
  }
};

const create = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    await User.validate({
      email, password, name, about, avatar,
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashedPassword, name, about, avatar,
    });
    user.password = undefined;
    return res.status(httpStatus.CREATED).send(user);
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next, data) => {
  try {
    const user = await User.findById(req.user.userId);
    user.set({ ...data });
    await user.save();
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const updateInfo = async (req, res, next) => {
  const data = { name: req.body.name, about: req.body.about };
  await update(req, res, next, data);
};

const updateAvatar = async (req, res, next) => {
  const data = { avatar: req.body.avatar };
  await update(req, res, next, data);
};

module.exports = {
  get,
  getMe,
  create,
  login,
  list,
  updateInfo,
  updateAvatar,
};
