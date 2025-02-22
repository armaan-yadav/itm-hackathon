import { client } from "@/lib/appwrite/appwrite";
import { Account, ID } from "appwrite";
import { AuthError } from "./error/error";
class AuthServices {
  client;
  account;

  constructor() {
    this.client = client;
    this.account = new Account(this.client);
  }

  //* SEND OTP
  async sendOTP({ phoneNumber }) {
    try {
      const ph = `+91${phoneNumber}`;
      const token = await this.account.createPhoneToken(ID.unique(), ph);
      console.log(ph);
      console.log(token);
      return token.userId;
    } catch (error) {
      console.log(error);
      throw AuthError.fromAppwriteError(error);
    }
  }

  //* VERIFY OTP
  async verifyOTP({ userId, otp }) {
    try {
      const session = await this.account.createSession(userId, otp);
      console.log(session);
      return session;
    } catch (error) {
      console.log(error);
      throw AuthError.fromAppwriteError(error);
    }
  }

  //* LOGOUT OTP
  async logout() {
    try {
      await this.account.deleteSessions();
      console.log("user logged out");
    } catch (error) {
      throw AuthError.fromAppwriteError(error);
    }
  }

  //* GET CURRENT USER
  async getCurrentUser() {
    try {
      const user = await this.account.get();

      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof AuthError) {
        error.log();
      }
      return undefined;
    }
  }
}

const authServices = new AuthServices();

export default authServices;
