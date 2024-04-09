import { ObjectId } from "mongodb";

export class Admin {
  constructor(public adminId: string, public passwordHash: string) {}
}

export class User {
  constructor(
    public userEmail: string,
    public location: string,
    public userInfo: { userName: string; userAvatarUrl?: string },
    public password: string,
    public role: "USER",
    public vehicleInfo?: ObjectId[],
    public _id?: ObjectId
  ) {}
}

export class Dealership {
  constructor(
    public dealershipEmail: string,
    public dealershipLocation: string,
    public password: string,
    public dealershipInfo: {
      dealershipName: string;
      dealershipAvatarUrl?: string;
    },
    public role: "DEALERSHIP",
    public car?: ObjectId[],
    public deals?: ObjectId[],
    public soldVehicles?: ObjectId[],
    public _id?: ObjectId
  ) {}
}

export class Deals {
  constructor(
    public dealId: string,
    public carId: string,
    public dealInfo: any
  ) {}
}

export class Cars {
  constructor(
    public make: string,
    public type: string,
    public model: string,
    public carInfo: {
      modelYear: string;
      carImages: string[];
    },
    public _id?: ObjectId
  ) {}
}

export class SoldVehicle {
  constructor(
    public vehicleId: string,
    public carId: string,
    public vehicleInfo: any
  ) {}
}

export class ResetPasswordOTP {
  constructor(
    public clientId: ObjectId,
    public clientEmail: string,
    public reset_otp: string,
    public expires_in: Date,
    public _id?: ObjectId
  ) {}
}
