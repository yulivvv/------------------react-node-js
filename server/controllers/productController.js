const uuid = require('uuid')
const path = require('path');
const {Product} = require('../models/models')
const ApiError = require('../error/ApiError');

class ProductController {
    async create(req, res, next){
        try {
            const {name, price, categoryId, description, quantity} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const product = await Product.create({name, price, categoryId, description, quantity, img:fileName})
            return res.json(product)
        } catch (e){
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res){
        let {categoryId, limit, page} = req.query
        //добавляем отображение товаров на одной странице
        page = page || 1
        limit = limit || 9
        let offset  = page * limit - limit
        let products;
        //если нет категории, то возвращаем все товары
        if (!categoryId){
            products = await Product.findAndCountAll({limit, offset})
        }
        //если категория есть, то роказывает товары данной категории
        if (categoryId){
            products = await Product.findAndCountAll({where:{categoryId, limit, offset}})
        }
        return res.json(products)
    }

    async getOne(req, res){
        const {id} = req.params
        const product = await Product.findOne(
            {
                where: {id},
                

            }
        )
        return res.json(product)
    }


    
}

module.exports = new ProductController()