import { ObjectId } from "mongodb";
import { db } from "../../db";
import { Dealership, Cars, Deals } from "../../models";

export async function getDealershipByID(id: ObjectId) {
  const res = await db
    .collection<Dealership>("Dealership")
    .findOne({ _id: id });
  return res;
}

export async function getDealershipCars(dealershipCars: ObjectId[]) {
  const res = await db
    .collection<Cars>("Cars")
    .find({ _id: { $in: dealershipCars } })
    .toArray();
  return res;
}

export async function addDealershipCars(carIds: ObjectId[], id: ObjectId) {
  await db.collection<Dealership>("Dealership").updateOne(
    { _id: id },
    {
      $push: { car: { $each: carIds } },
    }
  );
}

export async function getDealershipDeals(dealershipDeals: ObjectId[]) {
  const res = await db
    .collection<Deals>("Deals")
    .find({ _id: { $in: dealershipDeals } })
    .toArray();
  return res;
}
