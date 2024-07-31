import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Posts from "./PostModel.js";
import Packages from "./PackageModel.js";

const { DataTypes } = Sequelize;

const Bookings = db.define('bookings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bookingCode:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM("Pending", "Success"),
        defaultValue: "Pending",
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    visitDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    numberOfPeople: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    additionalNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    TotalDays:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bookingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    userId: {
        type: DataTypes.INTEGER
    },
    postId: {
        type: DataTypes.INTEGER
    },
    packageId: {
        type: DataTypes.INTEGER
    }

},{
        freezeTableName: true
    })

Users.hasMany(Bookings);
Bookings.belongsTo(Users, { foreignKey: 'userId' });
Bookings.belongsTo(Posts, { foreignKey: 'postId' });
Bookings.belongsTo(Packages, { foreignKey: 'packageId' });


export default Bookings
    