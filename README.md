# Advanced REST API

REST API with slight e-commerce flavour and role based authentication. A complete reference for REST API.

## Tech Stack

**Server:** Node, Express, MongoDB, Redis, JWT

## Features

- ES6
- Middlewares
- MongoDB & Redis
- MVC Architecture
- Fully Commented
- Clean Code
- DTOs
- Barrel exports
- Schema validations
- Image serving and storage
- Role based authentication
- Token based authentication
- Refresh and Access Tokens
- Rotating Refresh Tokens
- Pagination
- Better error messages with HTTP status
- One time use link for resetting password valid for 15 mins

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file

`APP_PORT`

`APP_URL`

`DB_URL`

`DB_NAME`

`REDIS_PORT`

`REDIS_URL`

`JWT_SECRET`

`REFRESH_SECRET`

`PASSWORD_RESET_JWT_SECRET`

To know more, check `demo.env` file

## Run Locally

Clone the project

```bash
  git clone https://github.com/pinakipb2/advanced-rest-api
```

Go to the project directory

```bash
  cd advanced-rest-api
```

Install dependencies

```bash
  npm install
```

Start the redis-server

```bash
  redis-server
```

Start the redis-commander (optional)

```bash
  npm install -g redis-commander
  redis-commander
```

Generate secret keys and add it to .env file

```bash
  npm run genkeys
```

Start the API

```bash
  npm run dev
```

## API Reference

#### Welcome Route

```http
  ANY /
```

#### API version Home Route

```http
  ANY /api/v1
```

#### Register a User (default role: CUSTOMER)

```http
  POST /api/v1/register
```

| Body               | Type     | Description                           |
| :----------------- | :------- | :------------------------------------ |
| `name`             | `string` | **Required**. User's Name             |
| `email`            | `string` | **Required**. User's Email            |
| `password`         | `string` | **Required**. User's Password         |
| `confirm_password` | `string` | **Required**. User's Confirm Password |

#### Login a User

```http
  POST /api/v1/login
```

| Body       | Type     | Description                   |
| :--------- | :------- | :---------------------------- |
| `email`    | `string` | **Required**. User's Email    |
| `password` | `string` | **Required**. User's Password |

#### WHO AM I?

```http
  GET /api/v1/me
```

| Header          | Type     | Description                             |
| :-------------- | :------- | :-------------------------------------- |
| `Authorization` | `string` | **Required**. Format: `Bearer ${token}` |

#### Refresh the Refresh Token

```http
  POST /api/v1/refresh
```

| Body            | Type     | Description                        |
| :-------------- | :------- | :--------------------------------- |
| `refresh_token` | `string` | **Required**. User's Refresh Token |

#### Logout the User

```http
  POST /api/v1/logout
```

| Body            | Type     | Description                        |
| :-------------- | :------- | :--------------------------------- |
| `refresh_token` | `string` | **Required**. User's Refresh Token |

| Header          | Type     | Description                             |
| :-------------- | :------- | :-------------------------------------- |
| `Authorization` | `string` | **Required**. Format: `Bearer ${token}` |

#### Forgot Password

```http
  POST /api/v1/forgot-password
```

| Body    | Type     | Description                |
| :------ | :------- | :------------------------- |
| `email` | `string` | **Required**. User's Email |

#### Reset the Password

```http
  POST /api/v1/reset-password/${id}/${token}
```

Params are generated by `/api/v1/forgot-password`.

| Params  | Type     | Description                                                |
| :------ | :------- | :--------------------------------------------------------- |
| `id`    | `string` | **Required**. User's ID                                    |
| `token` | `string` | **Required**. User's Token one time use, valid for 15 mins |

| Body               | Type     | Description                               |
| :----------------- | :------- | :---------------------------------------- |
| `password`         | `string` | **Required**. User's new Password         |
| `confirm_password` | `string` | **Required**. User's Confirm new Password |

#### Add a Product (admin-only)

```http
  POST /api/v1/add-product
```

| Multipart | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `name`    | `string` | **Required**. Name of the Product  |
| `price`   | `string` | **Required**. Price of the Product |
| `image`   | `string` | **Required**. Image of the Product |

| Header          | Type     | Description                             |
| :-------------- | :------- | :-------------------------------------- |
| `Authorization` | `string` | **Required**. Format: `Bearer ${token}` |

#### Update a Product by Id (admin-only)

```http
  POST /api/v1/update-product/${id}
```

| Params | Type     | Description                        |
| :----- | :------- | :--------------------------------- |
| `id`   | `string` | **Required**. Product ID to Update |

| Multipart | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `name`    | `string` | **Optional**. Name of the Product  |
| `price`   | `string` | **Optional**. Price of the Product |
| `image`   | `string` | **Optional**. Image of the Product |

| Header          | Type     | Description                             |
| :-------------- | :------- | :-------------------------------------- |
| `Authorization` | `string` | **Required**. Format: `Bearer ${token}` |

#### Delete a Product by Id (admin-only)

```http
  POST /api/v1/delete-product/${id}
```

| Params | Type     | Description                        |
| :----- | :------- | :--------------------------------- |
| `id`   | `string` | **Required**. Product ID to Delete |

| Header          | Type     | Description                             |
| :-------------- | :------- | :-------------------------------------- |
| `Authorization` | `string` | **Required**. Format: `Bearer ${token}` |

#### Get the list of all Products

```http
  GET /api/v1/all-products
```

| Query   | Type     | Description                                   |
| :------ | :------- | :-------------------------------------------- |
| `page`  | `number` | **Optional**. Default: 1                      |
| `limit` | `number` | **Optional**. Default: Length of all Products |

#### Get a single Product by Id

```http
  GET /api/v1/product/${id}
```

| Params | Type     | Description                      |
| :----- | :------- | :------------------------------- |
| `id`   | `string` | **Required**. Product ID to View |

## Contributing

Contributions are always welcome!

Please adhere to this project's `code of conduct`.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

- [@pinakipb2](https://www.github.com/pinakipb2)
