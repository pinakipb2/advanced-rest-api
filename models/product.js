import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 200,
      trim: true,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      requied: true,
      // uploads\\1653841060166-1159466621-XD80U-sjIH.jpg -> uploads/1653841060166-1159466621-XD80U-sjIH.jpg
      // Find the first index of number and slice upto that index
      set: (image) => 'uploads/' + image.slice(image.indexOf(image.match(/\d/))),
      // http://localhost:5000/uploads/1653841060166-1159466621-XD80U-sjIH.jpg
      get: (image) => `${process.env.APP_URL}/${image}`,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

// Adding validation for the unique constraints
productSchema.plugin(uniqueValidator);

export default mongoose.model('Product', productSchema, 'products');
