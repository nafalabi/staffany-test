import * as shiftRepository from "../database/default/repository/shiftRepository";
import * as publishedWeekRepository from "../database/default/repository/publishedWeekRepository";
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

  const isPublished = await publishedWeekRepository.findByDate(shift.date);
  if (isPublished) throw new Error("Couldn't create shift, the week has been published")

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

  const isPublished = await publishedWeekRepository.findByDate(payload.date);
  if (isPublished) throw new Error("Couldn't update shift, the week has been published")

  return shiftRepository.updateById(id, {
    ...payload,
  });
};

export const deleteById = async (id: string | string[]) => {
  const _id = Array.isArray(id) ? id[0] : id;
  const shiftData = await shiftRepository.findById(_id);

  const isPublished = await publishedWeekRepository.findByDate(shiftData.date);
  if (isPublished) throw new Error("Couldn't delete shift, the week has been published")

  return shiftRepository.deleteById(id);
};
