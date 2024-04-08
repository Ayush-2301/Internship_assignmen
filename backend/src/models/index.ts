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
    public vehicleInfo?: ObjectId[],
    public userId?: ObjectId
  ) {}
}

export class Dealership {
  constructor(
    public dealershipEmail: string,
    public dealershipName: string,
    public dealershipLocation: string,
    public passwordHash: string,
    public dealershipInfo: any,
    public cars: ObjectId[],
    public deals: ObjectId[],
    public soldVehicles: ObjectId[],
    public dealershipId?: ObjectId
  ) {}
}

export class Deal {
  constructor(
    public dealId: string,
    public carId: string,
    public dealInfo: any // Assuming deal_info is stored as a JSON object
  ) {}
}

export class Car {
  constructor(
    public carId: string,
    public type: string,
    public name: string,
    public model: string,
    public carInfo: any
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
    public id?: ObjectId
  ) {}
}
