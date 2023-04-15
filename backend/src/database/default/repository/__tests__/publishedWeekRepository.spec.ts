import * as typeorm from "typeorm";
import * as publishedWeekRepository from "../publishedWeekRepository";
import PublishedWeek from "../../entity/publishedWeek";

jest.mock("typeorm", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("typeorm") as typeof typeorm),
  };
});

describe("shiftRepository => find", () => {
  it("find => passed", async () => {
    const expectedData = new PublishedWeek();
    expectedData.startDate = "2023-04-10";
    expectedData.endDate = "2023-04-16";

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue({
        find: jest.fn().mockResolvedValue([expectedData]),
      } as any);

    const result = await publishedWeekRepository.find();

    expect(result).toEqual([expectedData]);
    expect(getRepositorySpy).toHaveBeenNthCalledWith(1, PublishedWeek);
    expect(typeorm.getRepository(PublishedWeek).find).toHaveBeenCalledTimes(1);
  });
});

describe("shiftRepository => findById", () => {
  it("findById => passed", async () => {
    const id = "0000-0000-000-000";

    const expectedData = new PublishedWeek();
    expectedData.id = id;
    expectedData.startDate = "2023-04-10";
    expectedData.endDate = "2023-04-16";

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(expectedData),
      } as any);

    const result = await publishedWeekRepository.findById(id);

    expect(result).toEqual(expectedData);
    expect(getRepositorySpy).toHaveBeenNthCalledWith(1, PublishedWeek);
    expect(typeorm.getRepository(PublishedWeek).findOne).toHaveBeenNthCalledWith(
      1,
      id,
      undefined
    );
  });
});

describe("shiftRepository => findOne", () => {
  it("findOne => passed", async () => {
    const id = "0000-0000-000-000";

    const expectedData = new PublishedWeek();
    expectedData.id = id;
    expectedData.startDate = "2023-04-10";
    expectedData.endDate = "2023-04-16";

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(expectedData),
      } as any);

    const result = await publishedWeekRepository.findOne({
      id: id,
    });

    expect(result).toEqual(expectedData);
    expect(getRepositorySpy).toHaveBeenNthCalledWith(1, PublishedWeek);
    expect(typeorm.getRepository(PublishedWeek).findOne).toHaveBeenNthCalledWith(
      1,
      { id },
      undefined
    );
  });
});

describe("shiftRepository => findByDate", () => {
  it("findByDate => passed", async () => {

    const expectedData = new PublishedWeek();
    expectedData.id = "0000-0000-000-000";
    expectedData.startDate = "2023-04-10";
    expectedData.endDate = "2023-04-16";

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(expectedData),
      } as any);

    const date = "2023-04-12";

    const result = await publishedWeekRepository.findByDate(date);

    expect(result).toEqual(expectedData);
    expect(getRepositorySpy).toHaveBeenNthCalledWith(1, PublishedWeek);
    expect(typeorm.getRepository(PublishedWeek).findOne).toHaveBeenNthCalledWith(
      1,
      {
        startDate: typeorm.LessThanOrEqual(date),
        endDate: typeorm.MoreThanOrEqual(date),
      }
    );
  });
});

describe("shiftRepository => create", () => {
  it("create => passed", async () => {
    const payload = new PublishedWeek();
    payload.startDate = "2023-04-10";
    payload.endDate = "2023-04-16";

    const expectedResult = {
      id: "0000-0000-0000-0000",
      startDate: "2023-04-10",
      endDate: "2023-04-16",
    };

    const getRepositorySpy = jest
      .spyOn(typeorm, "getRepository")
      .mockReturnValue({
        save: jest.fn().mockResolvedValue(expectedResult),
      } as any);

    const result = await publishedWeekRepository.create(payload);

    expect(result).toEqual(expectedResult);
    expect(getRepositorySpy).toHaveBeenNthCalledWith(1, PublishedWeek);
    expect(typeorm.getRepository(PublishedWeek).save).toHaveBeenNthCalledWith(
      1,
      payload
    );
  });
});

