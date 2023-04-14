import * as shiftRepository from "../database/default/repository/shiftRepository";
import { Between, FindManyOptions, FindOneOptions, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";
import Shift from "../database/default/entity/shift";
import { ICreateShift, IFindShift, IUpdateShift } from "../shared/interfaces";

export const find = async (query: IFindShift): Promise<Shift[]> => {
  const opts: FindManyOptions<Shift> = {
    where: {
      date: Between(query.startDate, query.endDate),
    }
  };
  return shiftRepository.find(opts);
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  return shiftRepository.findById(id, opts);
};

export const create = async (payload: ICreateShift): Promise<Shift> => {
  const shift = new Shift();
  shift.name = payload.name;
  shift.date = payload.date;
  shift.startTime = payload.startTime;
  shift.endTime = payload.endTime;

  const isExist = await shiftRepository.checkExist({
    date: shift.date,
    endTime: shift.endTime,
    startTime: shift.startTime,
  });

  if (isExist) throw new Error("Shift is overlapping with another shift");

  return shiftRepository.create(shift);
};

export const updateById = async (
  id: string,
  payload: IUpdateShift
): Promise<Shift> => {
  const isExist = await shiftRepository.checkExist({
    date: payload.date,
    endTime: payload.endTime,
    startTime: payload.startTime,
    id,
  });

  if (isExist) throw new Error("Shift is overlapping with another shift");

  return shiftRepository.updateById(id, {
    ...payload,
  });
};

export const deleteById = async (id: string | string[]) => {
  return shiftRepository.deleteById(id);
};
