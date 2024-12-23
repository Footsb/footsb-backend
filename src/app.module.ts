import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PingModule } from './modules/ping/ping.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [
        // entities for database
      ],
      keepConnectionAlive: true,
      migrations: [__dirname + '/migrations/*.ts'],
      charset: 'utf8mb4_general_ci',
      synchronize: true,
      logging: true
    }),
    PingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}