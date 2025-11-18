import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventLog, EventLogDocument } from '../../models/events.schema';


@Injectable()
export class EventsService {
    constructor(@InjectModel(EventLog.name) private eventModel: Model<EventLogDocument>) { }


    async createLog(entry: { type: string; userId?: string; payload?: any }) {
        const doc = new this.eventModel({ ...entry });
        return doc.save();
    }


    async findAll() {
        return this.eventModel.find().lean().exec();
    }
}