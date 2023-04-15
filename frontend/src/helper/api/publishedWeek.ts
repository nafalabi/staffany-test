import { getAxiosInstance } from ".";

export const getPublishedWeekStatus = async (startDate: string, endDate: string) => {
  const api = getAxiosInstance();
  const { data } = await api.get(`/published-week?startDate=${startDate}&endDate=${endDate}`);
  return data;
};

export const doPublishWeek = async (payload: any) => {
  const api = getAxiosInstance();
  const { data } = await api.post("/published-week", payload);
  return data;
};