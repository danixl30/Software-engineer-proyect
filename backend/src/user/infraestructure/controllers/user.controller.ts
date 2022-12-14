import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Delete,
    Put,
} from '@nestjs/common'
import { ExceptionDecorator } from 'src/core/application/decorators/exception.decorator'
import { Sha256Service } from 'src/core/infraestructure/crypto/sha256-crypto/service/sha256.crypto'
import { ConcreteExceptionReductor } from 'src/core/infraestructure/exception/exception.reductor'
import { ConcreteUUIDGenerator } from 'src/core/infraestructure/UUID/service/concrete.UUID.generator'
import { RegisterUserApplicationService } from 'src/user/application/services/register-user/register.user.application.service'
import { UserMongoRepository } from '../repositories/user.mongo.repository'
import { RegisterUserRequestDTO } from './dto/register.user.request'
import { Roles as RolesData } from 'src/user/domain/value-objects/roles'
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtProviderService } from 'src/core/infraestructure/token/jwt/service/jwt.provider.service'
import { UserLoginRequestDTO } from './dto/login.user.request'
import { LoginApplicationService } from 'src/user/application/services/login/login.application.service'
import { User as UserAuth } from '../decorators/user/user.decorator'
import { User } from 'src/user/domain/user'
import { UserGuard } from '../guards/auth/user.auth.guard'
import { DeleteUserApplicationService } from 'src/user/application/services/delete-user/delete.user.application.service'
import { EventHandlerNative } from 'src/core/infraestructure/event-handler/native/service/event.hadler.native.service'
import { RegisterAdminApplicationService } from 'src/user/application/services/register-admin/register.admin.application.service'
import { RegisterAdminRequestDTO } from './dto/register.admin.request'
import {
    SetStatus,
    Status,
} from 'src/core/infraestructure/decorators/http.status.decorator'
import { UpdateUsernameDTO } from './dto/update.username.dto'
import { ChangeUsernameApplicationService } from 'src/user/application/services/change-username/change.username.application.service'
import { UpdateUserEmailDTO } from './dto/update.email.dto'
import { ChangeEmailApplicationService } from 'src/user/application/services/change-email/change.email.application.service'
import { RolesGuard } from '../guards/roles/roles.guard'
import { Roles } from '../guards/roles/metadata/roles.metadata'
import { GetClientsApplicationService } from 'src/user/application/services/get-clients/get.clients.application.service'
import { UpdatePasswordDTO } from './dto/update.password.dto'
import { ChangePasswordApplicationService } from 'src/user/application/services/change-password/change.password.application.service'

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(
        private userRepository: UserMongoRepository,
        private uuidGenerator: ConcreteUUIDGenerator,
        private crypto: Sha256Service,
        private tokenManager: JwtProviderService,
        private eventHandler: EventHandlerNative,
    ) {}

    @Post('register')
    async register(@Body() registerDto: RegisterUserRequestDTO) {
        return await new ExceptionDecorator(
            new RegisterUserApplicationService(
                this.userRepository,
                this.crypto,
                this.uuidGenerator,
            ),
            new ConcreteExceptionReductor(),
        ).execute({ ...registerDto, role: RolesData.USER })
    }

    @Post('register/admin')
    async registerAdmin(@Body() registerDto: RegisterAdminRequestDTO) {
        return await new ExceptionDecorator(
            new RegisterAdminApplicationService(
                new RegisterUserApplicationService(
                    this.userRepository,
                    this.crypto,
                    this.uuidGenerator,
                ),
            ),
            new ConcreteExceptionReductor(),
        ).execute({ ...registerDto, role: RolesData.ADMIN })
    }

    @Post('auth/login')
    @ApiResponse({
        status: 200,
    })
    async login(
        @Body() loginDto: UserLoginRequestDTO,
        @Status() setStaus: SetStatus,
    ) {
        const data = await new ExceptionDecorator(
            new LoginApplicationService(
                this.userRepository,
                this.crypto,
                this.tokenManager,
            ),
            new ConcreteExceptionReductor(),
        ).execute(loginDto)
        setStaus(200)
        return data
    }

    @Get()
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async getData(@UserAuth() user: User) {
        return {
            id: user.id.value,
            email: user.email.value,
            username: user.username.value,
            role: user.role.value,
        }
    }

    @Get('clients')
    @ApiHeader({
        name: 'auth',
    })
    @Roles(RolesData.PROVIDER)
    @UseGuards(UserGuard, RolesGuard)
    async getClients() {
        return await new ExceptionDecorator(
            new GetClientsApplicationService(this.userRepository),
            new ConcreteExceptionReductor(),
        ).execute(null)
    }

    @Delete()
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async deleteUser(@UserAuth() user: User) {
        return await new ExceptionDecorator(
            new DeleteUserApplicationService(
                this.userRepository,
                this.eventHandler,
            ),
            new ConcreteExceptionReductor(),
        ).execute({
            id: user.id.value,
        })
    }

    @Put('update/username')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async updateUsername(
        @UserAuth() user: User,
        @Body() data: UpdateUsernameDTO,
    ) {
        return await new ExceptionDecorator(
            new ChangeUsernameApplicationService(
                this.userRepository,
                this.eventHandler,
            ),
            new ConcreteExceptionReductor(),
        ).execute({
            id: user.id.value,
            ...data,
        })
    }

    @Put('update/email')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async updateEmail(
        @UserAuth() user: User,
        @Body() data: UpdateUserEmailDTO,
    ) {
        return await new ExceptionDecorator(
            new ChangeEmailApplicationService(
                this.userRepository,
                this.eventHandler,
            ),
            new ConcreteExceptionReductor(),
        ).execute({
            id: user.id.value,
            ...data,
        })
    }

    @Put('update/password')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async updatePassword(
        @UserAuth() user: User,
        @Body() data: UpdatePasswordDTO,
    ) {
        return await new ExceptionDecorator(
            new ChangePasswordApplicationService(
                this.userRepository,
                this.crypto,
                this.eventHandler,
            ),
            new ConcreteExceptionReductor(),
        ).execute({
            id: user.id.value,
            ...data,
        })
    }
}
