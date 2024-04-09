import { Request, Response } from "express";
import {
  getCar,
  getAllCars,
  createCar,
  deleteCar,
  updateCar,
} from "./cars.repositry";
import { ObjectId } from "mongodb";
import { Cars } from "../../models";

export const getCarById = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const car = await getCar(id);
    if (!car)
      return res.status(410).send({ data: null, error: "Car not found" });
    return res.status(200).send({ data: car, error: null });
  } catch (error) {
    res.status(500).send({ data: null, erro: "Internal Server Error" });
  }
};

export const getCars = async (req: Request, res: Response) => {
  try {
    const cars = await getAllCars();
    if (!cars) {
      return res
        .status(410)
        .send({ data: null, error: "Cars does not exists" });
    }
    return res.status(200).send({ data: cars, error: null });
  } catch (error) {
    res.status(500).send({ data: null, error: "Internal Server Error" });
  }
};

export const createNewCar = async (req: Request, res: Response) => {
  try {
    const { make, type, model, carInfo } = req.body as Cars;

    await createCar({
      make,
      type,
      model,
      carInfo,
    });
    res.status(200).send({ data: { message: "Car added" }, error: null });
  } catch (error) {
    res.status(500).send({ data: null, error: "Internal Server Error" });
  }
};

export const updateCarById = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    console.log(id);
    const { carInfo, model, make, type } = req.body as Cars;
    const { modelYear, carImages } = carInfo;
    const car = await getCar(id);
    if (car) {
      car.make = make || car.make;
      car.model = model || car.model;
      car.type = type || car.type;
      car.carInfo.carImages = carImages || car.carInfo.carImages;
      car.carInfo.modelYear = modelYear || car.carInfo.modelYear;
      await updateCar(car);
      return res
        .status(200)
        .send({ data: { message: "Successfully updated car" }, error: null });
    } else {
      return res.status(410).send({ data: null, error: "Car does not exists" });
    }
  } catch (error) {
    res.status(500).send({ data: null, error: "Internal Server Error" });
  }
};

export const deleteCarById = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const car = await getCar(id);
    if (!car)
      return res.status(410).send({ data: null, error: "Car does not exist" });
    await deleteCar(id);
    res
      .status(200)
      .send({ data: { message: "Car deleted successfully" }, error: null });
  } catch (error) {
    res.status(500).send({ data: null, error: "Internal server error" });
  }
};
