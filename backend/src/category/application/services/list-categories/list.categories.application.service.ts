import { CategoryId } from 'src/category/domain/value-objects/category.id'
import { ApplicationService } from 'src/core/application/service/application.service'
import { CategoryNotFoundException } from '../../exceptions/category.not.found'
import { categoryDomainToPrimitive } from '../../mappers/category.domain.primitive'
import { CategoryRepository } from '../../repositories/category.repository'
import { ListCategoryDTO } from './types/list.categories.dto'
import { ListCategoryResponse } from './types/list.categories.response'

export class ListCategoryApplicationService
    implements ApplicationService<ListCategoryDTO, ListCategoryResponse>
{
    constructor(private categoryRepository: CategoryRepository) {}

    async execute(data: ListCategoryDTO): Promise<ListCategoryResponse> {
        if (data.id) {
            const category = await this.categoryRepository.searchById(
                new CategoryId(data.id),
            )
            if (!category) throw new CategoryNotFoundException()
            return {
                categories: [categoryDomainToPrimitive(category)],
            }
        }
        const list = await this.categoryRepository.list()
        const categories = list.map(categoryDomainToPrimitive)
        return {
            categories,
        }
    }
}