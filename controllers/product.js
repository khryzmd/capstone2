// Dependencies and Modules
const Product = require("../models/Product");
const { errorHandler } = require("../auth");

// Create a product
module.exports.addProduct = (req, res) => {
    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    return Product.findOne({ name:req.body.name })
    .then(existingProduct => {
        if(existingProduct){
            return res.status(409).send({message: "Product already exists"})
        } else {
            return newProduct.save()
            .then(result => res.status(201).send({
                product: result
            }))
            .catch(err => errorHandler(err, req, res));
        }
    }).catch(err => errorHandler(err, req, res));
}; 

// Retrieve all products
module.exports.getAllProducts = (req, res) => {
    return Product.find({})
    .then(result => {
        if (result.length > 0) {
            return res.status(200).send({
                products: result
            });
        } else {
            return res.status(404).send({message: 'No products found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

// Retrieve all active products
module.exports.getAllActive = (req, res) => {
    return Product.find({ isActive: true })
    .then(result => {
        if(result.length > 0){
            return res.status(200).send({
                products: result
            });
        } else {
            return res.status(404).send(false);
        }
    })
    .catch(error => errorHandler(error, req, res));
};

// Retrieve a single product
module.exports.getProduct = (req, res) => {
    return Product.findById(req.params.productId)
    .then(product => res.status(200).send({
        product: product
    }))
    .catch(err => errorHandler(err, req, res));
};

// Update product info
module.exports.updateProduct = (req, res)=>{
    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct, {new: true})
    .then(product => {
        if (product) {
            res.status(200).send({
                message: "Product updated successfully",
                updatedProduct: product
            });
        } else {
            res.send(false);
        }
    })
    .catch(error => errorHandler(error, req, res));
};

// Archive a product
module.exports.archiveProduct = (req, res) => {
    const productId = req.params.productId;
    
    return Product.findById(productId)
    .then(product => {
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        if (!product.isActive) {
            return res.status(200).send({ 
                message: "Product already archived",
                archiveProduct: product
            });
        }

        product.isActive = false;
        return product.save()
        .then(archivedProduct => res.status(200).send({
            message: "Product archived successfully",
            archiveProduct: archivedProduct
        }))
        .catch(error => errorHandler(error, req, res));
    })
    .catch(error => errorHandler(error, req, res));
};

// Activate a product
module.exports.activateProduct = (req, res) => {
    const productId = req.params.productId;
    
    return Product.findById(productId)
    .then(product => {
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        if (product.isActive) {
            return res.status(200).send({ 
                message: 'Product already activated', 
                activateProduct: product
            });
        }

        product.isActive = true;
        return product.save()
        .then(activatedProduct => res.status(200).send({
            message: 'Product activated successfully',
            activateProduct: activatedProduct
        }))
        .catch(error => errorHandler(error, req, res));
    })
    .catch(error => errorHandler(error, req, res));
};

// Search for products by their names
module.exports.searchProductsByName = async (req, res) => {
    try {
        const { productName } = req.body;

        const products = await Product.find({
          name: { $regex: productName, $options: 'i' }
      });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Search for products by price range
module.exports.searchProductsByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;

        if (minPrice == null || maxPrice == null) {
            return res.status(400).json({ message: 'Please provide both minPrice and maxPrice.' });
        }

        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

