
import {
  getRepository,
  FindManyOptions,
  FindOneOptions,
  FindConditions,
} from "typeorm";
import moduleLogger from "../../../shared/functions/logger";
import PublishedWeek from "../entity/publishedWeek";

const logger = moduleLogger("publishedWeekRepository");

export const find = async (opts?: FindManyOptions<PublishedWeek>): Promise<PublishedWeek[]> => {
  logger.info("Find");
  const repository = getRepository(PublishedWeek);
  const data = await repository.find(opts);
  return data;
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<PublishedWeek>
): Promise<PublishedWeek> => {
  logger.info("Find by id");
  const repository = getRepository(PublishedWeek);
  const data = await repository.findOne(id, opts);
  return data;
};

export const findOne = async (
  where?: FindConditions<PublishedWeek>,
  opts?: FindOneOptions<PublishedWeek>
): Promise<PublishedWeek> => {
  logger.info("Find one");
  const repository = getRepository(PublishedWeek);
  const data = await repository.findOne(where, opts);
  return data;
};

export const create = async (payload: PublishedWeek): Promise<PublishedWeek> => {
  logger.info("Create");
  const repository = getRepository(PublishedWeek);
  const newdata = await repository.save(payload);
  return newdata;
};
