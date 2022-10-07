import { CategoryId } from 'src/category/domain/value-objects/category.id'
import { ApplicationService } from 'src/core/application/service/application.service'
import { CategoryNotFoundException } from '../../exceptions/category.not.found'
import { CategoryRepository } from '../../repositories/category.repository'
import { DeleteCategoryDTO } from './types/delete.category.dto'
import { DeleteCategoryResponse } from './types/delete.category.response'

export class DeleteCategoryApplicationService
    implements ApplicationService<DeleteCategoryDTO, DeleteCategoryResponse>
{
    constructor(private categoryRepository: CategoryRepository) {}

    async execute(data: DeleteCategoryDTO): Promise<DeleteCategoryResponse> {
        const category = await this.categoryRepository.searchById(
            new CategoryId(data.id),
        )
        if (!category) throw new CategoryNotFoundException()
        await this.categoryRepository.delete(category)
        return {
            name: category.name.value,
            id: category.id.value,
        }
    }
}