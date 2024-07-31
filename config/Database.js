import { Sequelize } from "sequelize";

const db = new Sequelize("fofo_db", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

export default db;