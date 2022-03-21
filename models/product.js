import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 200,
      trim: true,
      required: true,
      // unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      requied: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

productSchema.plugin(uniqueValidator);

export default mongoose.model('Product', productSchema, 'products');
