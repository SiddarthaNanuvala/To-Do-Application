import sequelize from "./database";
import User from "./models/User"; 

const syncDatabase = async (): Promise<void> => {
    try {
        console.log("Synchronisation de la base de données...");

        await User.sync();

        console.log("Modèles détectés :", sequelize.models);

        await sequelize.sync({ alter: true });

        console.log("Base de données synchronisée avec succès !");
        process.exit();
    } catch (error) {
        console.error("Erreur lors de la synchronisation :", error);
        process.exit(1);
    }
};

console.log("Chargement du modèle User :", User === sequelize.models.User);

syncDatabase();
