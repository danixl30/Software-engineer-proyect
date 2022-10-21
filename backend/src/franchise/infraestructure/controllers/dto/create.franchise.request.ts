import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'

export class CreateFranchiseRequestDTO {
    @ApiProperty()
    @Length(5, 10)
    name: string
    @ApiProperty()
    @Length(1, 10)
    rif: string
}
