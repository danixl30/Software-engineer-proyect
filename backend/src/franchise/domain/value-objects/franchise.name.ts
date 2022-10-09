import { InvalidCategoryNameException } from 'src/category/domain/exceptions/invalid.category.name'
import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class FranchiseName implements ValueObject<FranchiseName> {
    constructor(private name: string) {
        if (name.isEmpty()) throw new InvalidCategoryNameException()
    }

    get value(): string {
        return this.name
    }

    equals(other: FranchiseName): boolean {
        return other.value === this.value
    }
}
