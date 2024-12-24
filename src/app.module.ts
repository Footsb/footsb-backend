import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import config, { DatabaseConfig, ENTYTIES, MODULES } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get<DatabaseConfig>('database');
        return {
          type: 'mysql',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          autoLoadEntities: true,
          entities: ENTYTIES,
          keepConnectionAlive: true,
          migrations: [__dirname + '/migrations/*.ts'],
          charset: 'utf8mb4_general_ci',
          synchronize: true,
          logging: true,
        };
      },
    }),
    ...MODULES,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
