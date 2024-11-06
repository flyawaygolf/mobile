import Realm from "realm";
import { myInformationInterface } from "../Client/Managers/Interfaces/Me";

// Définition de la classe utilisateur
export class userStoreSchema extends Realm.Object<myInformationInterface> {
  user_id!: string;
  nickname!: string;
  username!: string;
  avatar!: string;
  locale: string = "EN";
  premium_type!: number;
  flags!: number;
  banner?: string;
  accent_color?: string;
  language_spoken: Array<string> = [];
  description?: string;
  link?: string;
  certified?: boolean;
  pined_post?: string;
  trust_factor!: number;
  birthday!: Date;
  session_id!: string;
  token!: string;

  // Définir le nom et la clé primaire du schéma
  static primaryKey = "user_id";
}

// Créez un schéma Realm en utilisant la classe
const UserStoreRealmSchema: Realm.ObjectSchema = {
  name: "UserStore",
  primaryKey: userStoreSchema.primaryKey,
  properties: {
    user_id: "string",
    nickname: "string",
    username: "string",
    avatar: "string",
    locale: "string",
    premium_type: "int",
    flags: "int",
    banner: "string?",
    accent_color: "string?",
    language_spoken: "string[]",
    description: "string?",
    link: "string?",
    certified: "bool",
    pined_post: "string?",
    trust_factor: "int",
    birthday: "date",
    session_id: "string",
    token: "string",
  },
};

// Fonctions CRUD

// Ajouter un utilisateur
export const addUser = (realm: Realm, user: myInformationInterface) => {
  try {
    realm.write(() => {
      realm.create<userStoreSchema>(
        "UserStore",
        user,
        Realm.UpdateMode.Modified
      );
    });
  } catch (error) {
    console.error("Error adding user to Realm:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

// Modifier un utilisateur
export const updateUser = (realm: Realm, user_id: string, updatedData: Partial<myInformationInterface>) => {
  realm.write(() => {
    const user = realm.objectForPrimaryKey<userStoreSchema>("UserStore", user_id);
    if (user) {
      Object.keys(updatedData).forEach((key) => {
        (user as any)[key] = (updatedData as any)[key];
      });
    }
  });
};

// Supprimer un utilisateur
export const deleteUser = (realm: Realm, user_id: string) => {
  realm.write(() => {
    const user = realm.objectForPrimaryKey<userStoreSchema>("UserStore", user_id);
    if (user) {
      realm.delete(user);
    }
  });
};

// Récupérer tous les utilisateurs
export const getAllUsers = (realm: Realm) => {
  return realm.objects<userStoreSchema>("UserStore");
};

// Récupérer un utilisateur par ID
export const getUserById = (realm: Realm, user_id: string) => {
  return realm.objectForPrimaryKey<userStoreSchema>("UserStore", user_id);
};

export default UserStoreRealmSchema;
