const express = require('express');
const router = express.Router();

const Controller = require('./controller')

router.get('/product/list', Controller.getProductList)
router.post('/create/product',Controller.createProduct)

router.post('/add/item/cart',Controller.addItemToCart)
router.get('/delete/cart',Controller.deleteCart)

router.get('/cart/list', Controller.getcartlist)

module.exports = router