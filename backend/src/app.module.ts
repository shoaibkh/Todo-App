import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './components/auth/auth.module';
import { UsersModule } from './components/users/users.module';
import { TasksModule } from './components/tasks/tasks.module';
import { EventsModule } from './components/events/events.module';
console.log(process.env.DB_HOST);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),


    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5455,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'todoDB',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // disable in production
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/tasklogs'),
    AuthModule,
    UsersModule,
    TasksModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
