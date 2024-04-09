import { ObjectId, WithId } from "mongodb";
import { db } from "../../db";
import { Cars } from "../../models/index";

export async function getAllCars() {
  const res = await db.collection("Cars").find().toArray();
  return res;
}

export async function getCar(id: ObjectId) {
  const res = await db.collection<Cars>("Cars").findOne({ _id: id });
  return res;
}

export async function getCarByVIN(VIN: string) {
  const res = await db.collection<Cars>("Cars").findOne({ VIN: VIN });
  return res;
}

export async function createCar(req: Cars) {
  const { make, type, model, carInfo } = req;
  await db.collection<Cars>("Cars").insertOne({
    make: make,
    type: type,
    model: model,
    carInfo: carInfo,
  });
}

export async function updateCar(car: WithId<Cars>) {
  const { make, type, model, carInfo, _id } = car;
  console.log(car);
  const data = await db.collection<Cars>("Cars").updateOne(
    { _id: _id },
    {
      $set: {
        make: make,
        type: type,
        model: model,
        carInfo: carInfo,
      },
    }
  );
  console.log(data);
}

export async function deleteCar(id: ObjectId) {
  await db.collection<Cars>("Cars").deleteOne({ _id: id });
}

export async function createMultipleCars(cars: Cars[]) {
  const carId = (await db.collection<Cars>("Cars").insertMany(cars))
    .insertedIds;
  return carId;
}
