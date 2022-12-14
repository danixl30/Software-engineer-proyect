import { Module } from '@nestjs/common'
import { ControllersModule } from '../controllers/controllers.module'
import { DatabaseConnectionModule } from '../database/database.connection.module'
import { EventHandlerModule } from '../event-handler/event.handler.module'
import { EventListenerModule } from '../event-listener/event.listener.module'
import { FileUpploaderModule } from '../file-upploader/file.upploader.module'
import { GatewayModule } from '../gateway/gateway.module'
import { RateLimitModule } from '../rate-limit/rate.limit.module'

@Module({
    imports: [
        RateLimitModule,
        DatabaseConnectionModule,
        ControllersModule,
        EventHandlerModule,
        FileUpploaderModule,
        EventListenerModule,
        GatewayModule,
    ],
})
export class AppModule {}
