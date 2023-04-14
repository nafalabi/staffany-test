import * as publishedWeekRepository from "../database/default/repository/publishedWeekRepository";
import { FindManyOptions, FindOneOptions } from "typeorm";
import PublishedWeek from "../database/default/entity/publishedWeek";
import { ICreatePublishedWeek } from "../shared/interfaces";

export const find = async (opts: FindManyOptions<PublishedWeek>): Promise<PublishedWeek[]> => {
  return publishedWeekRepository.find(opts);
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<PublishedWeek>
): Promise<PublishedWeek> => {
  return publishedWeekRepository.findById(id, opts);
};

export const create = async (payload: ICreatePublishedWeek): Promise<PublishedWeek> => {
  const shift = new PublishedWeek();
  shift.startDate = payload.startDate;
  shift.endDate = payload.endDate;

  return publishedWeekRepository.create(shift);
};
