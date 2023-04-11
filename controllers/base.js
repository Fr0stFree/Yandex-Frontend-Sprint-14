const httpStatus = require('http-status');

const { ObjectDoesNotExist } = require('../utils/errors');

module.exports = class BaseController {
  constructor(Model, idUrlKwarg) {
    this.Model = Model;
    this.idUrlKwarg = idUrlKwarg || 'id';
  }

  get = async (req, res) => {
    const idUrlKwarg = this.getIdUrlKwarg(req);
    try {
      const obj = await this.getObjOrRaiseError({ _id: idUrlKwarg });
      return res.send(obj);
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(httpStatus.BAD_REQUEST)
          .send({ message: 'Невалидные данные' });
      }
      if (err instanceof ObjectDoesNotExist) {
        return res.status(httpStatus.NOT_FOUND)
          .send({ message: `Объект с id ${idUrlKwarg} не найден` });
      }
      return res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: `Произошла ошибка: ${err.message}` });
    }
  };

  create = async (req, res) => {
    try {
      const obj = await this.Model.create({ ...req.body });
      return res.status(httpStatus.CREATED)
        .send(obj);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(httpStatus.BAD_REQUEST)
          .send({ message: 'Невалидные данные' });
      }
      return res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: `Произошла ошибка: ${err.message}` });
    }
  };

  list = async (req, res) => {
    try {
      const objects = await this.Model.find({});
      res.send(objects);
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: `Произошла ошибка: ${err.message}` });
    }
  };

  update = async (req, res) => {
    const idUrlKwarg = this.getIdUrlKwarg(req);
    try {
      const obj = await this.getObjOrRaiseError({ _id: idUrlKwarg });
      obj.set({ ...req.body });
      await obj.save();
      return res.send(obj);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(httpStatus.BAD_REQUEST)
          .send({ message: 'Невалидные данные' });
      }
      if (err instanceof ObjectDoesNotExist) {
        return res.status(httpStatus.NOT_FOUND)
          .send({ message: `Объект с id ${idUrlKwarg} не найден` });
      }
      return res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: `Произошла ошибка: ${err.message}` });
    }
  };

  delete = async (req, res) => {
    const idUrlKwarg = this.getIdUrlKwarg(req);
    try {
      const obj = await this.getObjOrRaiseError({ _id: idUrlKwarg });
      await obj.deleteOne();
      return res.send({ message: 'Объект успешно удален' });
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(httpStatus.BAD_REQUEST)
          .send({ message: 'Невалидные данные' });
      }
      if (err instanceof ObjectDoesNotExist) {
        return res.status(httpStatus.NOT_FOUND)
          .send({ message: `Объект с id ${idUrlKwarg} не найден` });
      }
      return res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: `Произошла ошибка: ${err.message}` });
    }
  };

  getIdUrlKwarg = (req) => req.idUrlKwarg || req.params[this.idUrlKwarg];

  getObjOrRaiseError = async (data) => {
    const obj = await this.Model.findOne({ ...data });
    if (!obj) {
      throw new ObjectDoesNotExist();
    }
    return obj;
  };
};
