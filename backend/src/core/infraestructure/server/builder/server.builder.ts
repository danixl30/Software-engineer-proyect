import { Builder } from 'src/utils/builder/builder'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { createServer } from '../create-server/create.server'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { DocumentationProps } from './types/documentation.props'
import { TypeClass } from 'src/utils/type-class/type.class'

export class ServerBuilder implements Builder<INestApplication> {
    private constructor(private app: INestApplication) {}

    setGlobalProfix(prefix: string) {
        this.app.setGlobalPrefix(prefix)
        return this
    }

    setCors(allowDomains: string[] = []) {
        if (!allowDomains || allowDomains.isEmpty()) {
            this.app.enableCors()
            return this
        }
        this.app.enableCors({ origin: allowDomains })
        return this
    }

    setValidationPipe() {
        this.app.useGlobalPipes(new ValidationPipe())
        return this
    }

    setDocumentation(props: DocumentationProps) {
        const config = new DocumentBuilder()
            .setTitle(props.title)
            .setDescription(props.description)
            .setVersion(props.version)
            .build()
        const document = SwaggerModule.createDocument(this.app, config)
        SwaggerModule.setup(props.path, this.app, document)
        return this
    }

    build(): INestApplication {
        return this.app
    }

    static async create<T, U extends TypeClass<T>>(appModule: U) {
        const app = await createServer(appModule)
        return new ServerBuilder(app)
    }
}
