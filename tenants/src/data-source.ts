import "reflect-metadata"
import { DataSource } from "typeorm"
import { Tenant } from "./entity/Tenant"
import { ServicePath } from "./entity/ServicePath"
import { Category } from "./entity/Category"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5434,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [Tenant, ServicePath, Category],
    migrations: [],
    subscribers: [],
})
