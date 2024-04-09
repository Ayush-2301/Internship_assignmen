import { Request, Response } from "express";
import {
  getDealershipByID,
  getDealershipCars,
  getDealershipDeals,
  addDealershipCars,
} from "./dealership.repositry";
import { createMultipleCars } from "../cars/cars.repositry";
import { ObjectId } from "mongodb";
import { Cars } from "../../models";

export const getAllDealershipCars = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const dealership = await getDealershipByID(id);
    if (!dealership)
      return res
        .status(404)
        .send({ data: null, error: "Dealership not found" });
    if (!dealership.car)
      return res
        .status(404)
        .send({ data: null, error: "Dealership has no cars" });
    const cars = await getDealershipCars(dealership.car);
    return res.status(200).send({ data: cars, error: null });
  } catch (error) {
    res.status(500).send({ data: null, error: "Internal server error" });
  }
};

export const getAllDealershipDeals = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const dealership = await getDealershipByID(id);
    if (!dealership)
      return res
        .status(404)
        .send({ data: null, error: "Dealership not found" });
    if (!dealership.deals)
      return res
        .status(404)
        .send({ data: null, error: "Dealership has no deals" });
    const deals = await getDealershipDeals(dealership.deals);
    return res.status(200).send({ data: deals, error: null });
  } catch (error) {
    res.status(500).send({ data: null, error: "Internal Server Error" });
  }
};

export const createDealershipCars = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const dealership = await getDealershipByID(id);
    if (!dealership)
      return res
        .status(404)
        .send({ data: null, error: "Dealership not found" });
    const cars = req.body as Cars[];
    const carIdsObject = await createMultipleCars(cars);
    const carIds = Object.values(carIdsObject) as ObjectId[];
    console.log(carIds);
    await addDealershipCars(carIds, id);
    return res
      .status(200)
      .send({ data: { message: "Added cars" }, error: null });
  } catch (error) {
    res.status(500).send({ data: null, error: "Internal server error" });
  }
};
