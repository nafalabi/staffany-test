import { endOfWeek, format, parse, startOfWeek } from "date-fns";

export const parseDate = (dateString: string, formatstring: string = 'yyyy-MM-dd') => {
  return parse(dateString, formatstring, new Date(), { weekStartsOn: 1 });
};

export const formatDate = (date: Date, formatstring: string = 'yyyy-MM-dd') => {
  return format(date, formatstring);
}

export const getStartOfWeek = (date: Date) => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

export const getEndOfWeek = (date: Date) => {
  return endOfWeek(date, { weekStartsOn: 1 });
};
