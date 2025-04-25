export const formatTimestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};
