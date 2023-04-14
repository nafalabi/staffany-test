export interface IFindShift {
  startDate: string;
  endDate: string;
}

export interface ICheckShiftExist {
  date: string;
  startTime: string;
  endTime: string;
  id?: string;
}

export interface ICreateShift {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface IUpdateShift {
  name?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  weekId? : string;
}