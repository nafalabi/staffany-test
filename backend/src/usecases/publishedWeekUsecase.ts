import * as publishedWeekRepository from "../database/default/repository/publishedWeekRepository";
import { FindConditions, FindManyOptions, FindOneOptions } from "typeorm";
import PublishedWeek from "../database/default/entity/publishedWeek";
import { ICreatePublishedWeek } from "../shared/interfaces";

export const find = async (opts: FindConditions<PublishedWeek>): Promise<PublishedWeek> => {
  return publishedWeekRepository.findOne(opts);
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<PublishedWeek>
): Promise<PublishedWeek> => {
  return publishedWeekRepository.findById(id, opts);
};

export const findByDate = async (date: string) => {
  return publishedWeekRepository.findByDate(date);
}

export const create = async (payload: ICreatePublishedWeek): Promise<PublishedWeek> => {
  const shift = new PublishedWeek();
  shift.startDate = payload.startDate;
  shift.endDate = payload.endDate;

  return publishedWeekRepository.create(shift);
};
