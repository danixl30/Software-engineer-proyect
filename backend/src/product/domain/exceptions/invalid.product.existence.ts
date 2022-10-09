import { DomainException } from 'src/core/domain/exception/domain.exception'

export const INVALID_PRODUCT_EXISTENCE = 'INVALID_PRODUCT_EXISTENCE'
export class InvalidProductExistenceException extends DomainException {
    constructor() {
        super(INVALID_PRODUCT_EXISTENCE)
    }
}
