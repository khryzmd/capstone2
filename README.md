## Capstone 2 Overview

### Application Name: E-Commerce API

### Author: Khryzmiel Dabu

### User Credentials

- Admin User
	- email: admin@mail.com
	- password: admin123
- Dummy customer
	- email: customer@mail.com
	- password: customer123

### Features

User Resources:
- User registration
- User authentication
- Set user as admin (Admin only)
- Retrieve User Details
- Update Password

Product Resources:
- Create Product (Admin only)
- Retrieve all products (Admin only)
- Retrieve all active products
- Retrieve single product
- Update Product Information (Admin only)
- Archive Product (Admin only)
- Activate Product (Admin only)

Cart Resources:
- Get User's Cart
- Add to Cart
	- Subtotal for each item
	- Total price for all items
- Change product quantities
- Remove a product from cart
- Clear Cart

Order Resources:
- Non-admin User checkout (Create Order)
- Retrieve authenticated user's orders
- Retrieve all orders (Admin only)