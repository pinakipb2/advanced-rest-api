/* All the routes of the REST API is in this file. */
import express from 'express';
const router = express.Router();

import { registerController, loginController, userController, refreshController, productController, passwordController } from '../controllers';
import { auth, admin, productPaginatedResults } from '../middlewares';

// Register route for user default role -> customer
router.post('/register', registerController.register);
// Login route for the user
router.post('/login', loginController.login);
// Route to check the logged in user's details
router.get('/me', auth, userController.me);
// Route to refresh the access and refresh token
router.post('/refresh', refreshController.refresh);
// Route to logout the current logged in user
router.post('/logout', auth, loginController.logout);
// Takes in an email and generates a One time 15m valid link to reset password
router.post('/forgot-password', passwordController.forgot);
/* Route is the link generated from forgot-password and takes in password and confirm_password
   then it resets the password */
router.post('/reset-password/:id/:token', passwordController.reset);

// Route to add a product ("admin" role only)
router.post('/add-product', [auth, admin], productController.add);
// Route to update a product by product id ("admin" role only)
router.post('/update-product/:id', [auth, admin], productController.update);
// Route to delete a product by product id ("admin" role only)
router.post('/delete-product/:id', [auth, admin], productController.delete);
// Get the list of all Products with query default to page=1 and limit=Product.count
router.get('/all-products', productPaginatedResults, productController.showAll);
// Get a single Product by id
router.get('/product/:id', productController.singleProduct);

export default router;
