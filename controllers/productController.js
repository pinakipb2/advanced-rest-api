import { Product } from '../models';
import multer from 'multer';
import path from 'path';
import createError from 'http-errors';
import fs from 'fs';
import Joi from 'joi';
import { productDTO } from '../dtos';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e10)}${path.extname(file.originalname)}`;
    // 1647833402413-506306544.png
    cb(null, uniqueFileName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: {
    fileSize: 1000000 * 5, // 5 MB
  },
}).single('image'); // single image, fieldname : image

const productController = {
  async store(req, res, next) {
    // Multipart form data
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(createError.InternalServerError());
      }
      console.log(req.file.path);
      if (!req.file.path) {
        // Delete the uploaded file
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(createError.InternalServerError());
          }
        });
        return next(createError.UnprocessableEntity());
      }
      const filePath = req.file.path;
      // validation
      const productSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
      });
      const { error } = productSchema.validate(req.body);
      if (error) {
        console.log('here');
        // Delete the uploaded file
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(createError.InternalServerError());
          }
        });
        return next(createError.UnprocessableEntity());
      }
      const { name, price } = req.body;
      let newProduct;
      try {
        newProduct = await Product.create({ name, price, image: filePath });
        newProduct = new productDTO(newProduct);
        console.log(newProduct);
      } catch (error) {
        return next(createError.InternalServerError());
      }
      res.status(201).json(newProduct);
    });
  },
  async update(req, res, next) {},
};

export default productController;
