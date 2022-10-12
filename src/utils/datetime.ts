import moment from "moment";

export const toBrowserTime = (utc?: Date, format?: string) => {
  const timeUTCFormat = utc ? moment(utc).format() : '';
  const newDate = new Date(timeUTCFormat);

  const timeLocal = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000);

  return utc ? moment(timeLocal).format(format) : '';
};

export const toUTCString = (date: Date, format: string) => {
  const timeUTCFormat = date ? moment(date).format() : '';
  const newDate = new Date(timeUTCFormat);

  const timeLocal = new Date(newDate.getTime() + newDate.getTimezoneOffset() * 60 * 1000);

  return date ? moment(timeLocal).format(format) : '';
};

export const toLocalTime = (date: Date) => {
  const newDate = new Date(date);
  return new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000);
}

export const convertTimeToString = (date: Date) => {
  const hours = new Date(date).getHours();
  const minus = new Date(date).getMinutes();

  const value =
    (hours < 10 ? "0" + hours : hours) +
    ":" +
    (minus < 10 ? "0" + minus : minus);

  return value;
};
