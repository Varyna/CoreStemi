export interface DirectoryTime {
  id: number;
  name: string;
}

export interface DirectoryGroup {
  id: number;
  name: string;
}

export interface DirectoryCabinets {
  name: string;
}

export interface Lesson {
  directoryGroup: DirectoryGroup;
  directoryTime: DirectoryTime;
  directoryCabinets: DirectoryCabinets;
  subject: string;
  numberLecture: number;
  teacher: string;
}

export interface TimeTableDto {
  cabinet: string;
  numberLecture: number;
  subject: string;
  time: string;
  teacher: string;
}

export interface TheadInformationDto {
  directoryTimes: DirectoryTime[];
  groupName: string;
  kab: string;
  timeTable: TimeTableDto[];
}

export interface GroupInformationDto {
  group: string[];
}

export interface DataTable {
  columns: string[];
  rows: any[][];
}

export interface MainModel {
  tables: DataTable[];
  groupInformations: GroupInformationDto[];
  date: Date;
  corpus: number;
  news: string[];
  img: string;
}

export interface ScheduleRequest {
  corpus?: number;
  date?: string;
  next?: boolean;
}
