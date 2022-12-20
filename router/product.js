import { Router } from 'express'
import { createProduct, getProduct, getProducts } from '../controllers/products.js'

const router = Router()

// products會進入createProduct這function
router.post('/', createProduct)
router.get('/', getProducts)
router.get('/:id', getProduct)

export default router
