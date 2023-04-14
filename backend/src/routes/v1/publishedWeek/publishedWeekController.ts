import { Request, ResponseToolkit } from "@hapi/hapi";
import * as publishedWeek from "../../../usecases/publishedWeekUsecase";
import { errorHandler } from "../../../shared/functions/error";
import {
  ISuccessResponse,
  ICreatePublishedWeek,
} from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";

const logger = moduleLogger("publishedWeekController");

export const find = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find publishedWeeks");
  try {
    const filter = req.query;
    const data = await publishedWeek.find(filter);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get published week successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const findById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find publishedWeek by id");
  try {
    const id = req.params.id;
    const data = await publishedWeek.findById(id);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get published week successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const create = async (req: Request, h: ResponseToolkit) => {
  logger.info("Create publishedWeek");
  try {
    const body = req.payload as ICreatePublishedWeek;
    const data = await publishedWeek.create(body);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Create published week successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};
