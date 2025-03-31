import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.USER_DB_NAME as string,
    process.env.USER_DB_USER as string,
    process.env.USER_DB_PASSWORD as string,
    {
        host: process.env.USER_DB_HOST,
        dialect: "postgres",
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export default sequelize;
