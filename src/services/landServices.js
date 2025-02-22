import { client, databases } from "@/lib/appwrite/appwrite";
import { Query } from "appwrite";

class LandServices {
  constructor() {
    this.client = client;
    this.databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    this.landsCollectionId = import.meta.env.VITE_APPWRITE_LANDS_COLLECTION_ID;
    this.databases = databases;
  }

  async addLand({ land }) {
    console.log("land", land);
    try {
      const response = await this.databases.createDocument(
        this.databaseId,
        this.landsCollectionId,
        ID.unique(),
        { ...land }
      );
      return response;
    } catch (error) {
      console.error("Error adding land to DB:", error);
      throw error;
    }
  }

  async fetchLand({ limit = 5, offset = 0 }) {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.landsCollectionId,
        [Query.limit(limit), Query.offset(offset)]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching lands:", error);
      throw error;
    }
  }

  async fetchLandsByAttribute({ attribute, value, limit = 5, offset = 0 }) {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.landsCollectionId,
        [
          Query.equal(attribute, value),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );
      return response.documents;
    } catch (error) {
      console.error(
        `Error fetching lands where ${attribute} = ${value}:`,
        error
      );
      throw error;
    }
  }

  async getLandById(landId) {
    try {
      const response = await this.databases.getDocument(
        this.databaseId,
        this.landsCollectionId,
        landId
      );
      return response;
    } catch (error) {
      console.error(`Error fetching land with ID ${landId}:`, error);
      throw error;
    }
  }
}

export const landServices = new LandServices();
