export const formatDate = (str: string) => {
  const date = new Date(str);
  return date.toISOString().slice(0, 10);
};
