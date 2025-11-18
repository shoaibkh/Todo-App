import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventLog, EventLogSchema } from '../../models/events.schema';


@Module({
    imports: [MongooseModule.forFeature([{ name: EventLog.name, schema: EventLogSchema }])],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule { }