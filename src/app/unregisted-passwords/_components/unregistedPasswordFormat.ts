import dayjs from 'dayjs';

export const formatListDate = (value: string): string => {
  const date = dayjs(value);
  if (!date.isValid()) {
    return value;
  }

  return date.format('YYYY-MM-DD');
};

export const formatDateTime = (value: string): string => {
  const date = dayjs(value);
  if (!date.isValid()) {
    return value;
  }

  return date.format('YYYY/MM/DD HH:mm:ss');
};

export const formatDateTimeToMinute = (value: string): string => {
  const date = dayjs(value);
  if (!date.isValid()) {
    return value;
  }

  return date.format('YYYY-MM-DD HH:mm');
};
