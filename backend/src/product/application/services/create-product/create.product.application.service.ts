import { CategoryId } from 'src/category/domain/value-objects/category.id'
import { ApplicationService } from 'src/core/application/service/application.service'
import { UUIDGenerator } from 'src/core/application/UUID/UUID.generator'
import { ProductCurrency } from 'src/product/domain/value-objects/product.currency'
import { ProductName } from 'src/product/domain/value-objects/product.name'
import { Product } from 'src/product/domain/product'
import { CategoryRef } from 'src/product/domain/value-objects/category.ref'
import { ProductDescription } from 'src/product/domain/value-objects/product.description'
import { ProductExistence } from 'src/product/domain/value-objects/product.existence'
import { ProductId } from 'src/product/domain/value-objects/product.id'
import { ProductPrice } from 'src/product/domain/value-objects/product.price'
import { ProductRepository } from '../../repositories/product.repository'
import { CreateProductDTO } from './types/create.product.dto'
import { CreateProductResponse } from './types/create.product.response'

export class CreateProductApplicationService
    implements ApplicationService<CreateProductDTO, CreateProductResponse>
{
    constructor(
        private productRepository: ProductRepository,
        private uuid: UUIDGenerator,
    ) {}

    async execute(data: CreateProductDTO): Promise<CreateProductResponse> {
        const product = new Product(
            new ProductId(this.uuid.generate()),
            new ProductName(data.name),
            new ProductDescription(data.description),
            new ProductExistence(data.existence),
            new ProductPrice(data.price),
            new ProductCurrency(data.currency),
            new CategoryRef(new CategoryId(data.category)),
        )
        await this.productRepository.save(product)
        return {
            id: product.id.value,
        }
    }
}