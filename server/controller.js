const cart = require('./models/cart')
const product = require('./models/product')

const createProduct = async(req,res,next) => {
    let payload = req.body
    try {
        let data = await product.create({
            productId: payload.productId,
            productName: payload.productName,
            productPrice: payload.productPrice
        })
        if(data){
            res.json({
                status: 200,
                data
            })
        }
    } catch(error) {
        console.log(error)
        res.json({
            status: 500,
            message: "Internal server error"
        })
    }
}

const getProductList = async(req,res,next) => {
    try {
        let productList = await product.find({})
        if(!productList.length){
            res.json({
                stats: 409
            })
        }else {
            res.json({
                status: 200,
                data: productList
            })
        }
    } catch(error) {
        console.log(error)
        res.json({
            status: 500,
            message: "Internal server error"
        })
    }
}

const addItemToCart = async(req,res,next) => {
    let payload = req.body
    console.log("payload", payload)
    try {
        let data = await Promise.all(payload && payload.map(async pr => {
            return await cart.create({
                productId: pr.productId,
                noOfItems: pr.noOfItems,
                amount: pr.amount
            })
        }))
        console.log("data", data)
        if(data){
            res.json({
                status: 200,
                data
            })
        }
    } catch(error) {
        console.log(error)
        res.json({
            status: 500,
            message: "Internal server error"
        })
    }
}

const getcartlist = async(req,res,next) => {
    try {
        let cartList = await cart.aggregate([
            {
                $lookup: {
                    from: "productmodels",
                    localField: "productId",
                    foreignField: "productId", 
                    as: "products"
                }
            },
            {
                $unwind: {
                    path: "$products"
                }
            },
            {
                $group: {
                    "_id": "id",
                    "total": {
                        $sum : "$amount"
                    },
                    "data": {
                        $push: {
                            "productName": "$products.productName",
                            "productPrice": "$products.productPrice",
                            "productId": "$productId",
                            "amount": "$amount",
                            "noOfItems": "$noOfItems",
                            "discountPrice": 0
                        }
                    }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "data" :1,
                    "total": 1
                }
            }
        ])
        if(!cartList.length){
            res.json({
                stats: 409
            })
        }else {
            let  newtotal = 0, isTwentyRsDiscountApplied = false;
            cartList[0].data && cartList[0].data.map(ct => {
                if(ct.productId == "1" && ct.noOfItems >= 3){
                    ct.discountPrice =  ct.noOfItems * 5 
                    ct.priceAfterDiscount = ct.amount - ct.discountPrice

                } else if(ct.productId == "2" && ct.noOfItems >= 2){
                    ct.discountPrice = ct.noOfItems * 2.5 
                    ct.priceAfterDiscount = ct.amount - ct.discountPrice
                }

                newtotal = ( ct.discountPrice === 0 ? ct.amount : ct.priceAfterDiscount ) + newtotal 
            })
            if(newtotal > 150){
                newtotal = newtotal - 20
                isTwentyRsDiscountApplied = true
            }
            let totalDiscount = cartList[0].total - newtotal
            res.json({
                status: 200,
                data: {
                    data: cartList[0].data,
                    originalTotal:cartList[0].total,
                    newtotal: newtotal,
                    totalDiscount: totalDiscount,
                    isTwentyRsDiscountApplied: isTwentyRsDiscountApplied
                }
            })
        }
    } catch(error) {
        console.log(error)
        res.json({
            status: 500,
            message: "Internal server error"
        })
    }
}

const deleteCart = async(req,res,next) => {
    try {
        await cart.deleteMany({})
        res.json({
            status: 200,
            message: "Deleted successfully"
        })
    } catch(error) {
        console.log(error)
        res.json({
            status: 500,
            message: "Internal server error"
        })
    }
}

module.exports = {
    createProduct,
    getProductList,
    addItemToCart,
    deleteCart,
    getcartlist
}


