import createError from 'http-errors';
import { Product } from '../models';
import { productDTO } from '../dtos';

/* Returns paginated results of the Product model */
const productPaginatedResults = async (req, res, next) => {
  try {
    // Get the page query, default to 1
    const page = parseInt(req.query.page, 10) || 1;
    // Get the limit query, default to Product length
    const totalProductCount = await Product.countDocuments().exec();
    const limit = parseInt(req.query.limit, 10) || totalProductCount;
    // Calculating the start and end index
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Response to return
    const results = {};
    // If not first page, then it has previous page
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    // Add a self page
    results.self = {
      page: page,
      limit: limit,
    };
    // If last page, then it has no next page
    if (endIndex < totalProductCount) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    results.total = totalProductCount;
    try {
      /* Find all products and populate them by addedBy
         and sort them using descending order of updation
         along with pagination of page and limit
      */
      const products = await Product.find().populate('addedBy').sort({ updatedAt: -1 }).limit(limit).skip(startIndex).exec();
      // Iterate through all products and getting rid of unnecessary fields using DTO
      const allProducts = await Promise.all(
        products.map((product) => {
          return new productDTO(product);
        })
      );
      // Set the products response
      results.products = allProducts;
      res.paginatedResults = results;
      next();
    } catch (err) {
      return next(createError.InternalServerError());
    }
  } catch (err) {
    return next(createError.InternalServerError());
  }
};

export default productPaginatedResults;
