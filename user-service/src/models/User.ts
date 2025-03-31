import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";
import bcrypt from "bcryptjs"; 

interface UserAttributes {
  id: number;
  email: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare email: string;
  declare password: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
  }
);

export const createDefaultUser = async () => {
  try {
    const existingUser = await User.findOne({ where: { email: "admin@email.com" } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({ email: "admin@email.com", password: hashedPassword });
      console.log("Admin user created: admin@email.com / admin123");
    } else {
      console.log("ℹ Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

export default User;
