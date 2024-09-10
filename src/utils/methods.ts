export const wordToDots = (content: string, length: number) =>
  content.length < length ? content : content.slice(0, length) + "...";

export const formatTimeStamp = (timeStamp: Date) => {
  const dateTimeStamp = new Date(timeStamp);
  const today = new Date();
  const isToday =
    dateTimeStamp.getDate() === today.getDate() &&
    dateTimeStamp.getMonth() === today.getMonth() &&
    dateTimeStamp.getFullYear() === today.getFullYear();

  return isToday
    ? dateTimeStamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : `${dateTimeStamp.toLocaleDateString()} ${dateTimeStamp.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}`;
};
