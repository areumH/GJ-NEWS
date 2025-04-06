export const slicePageByLimit = (totalPage: number, limit: number): number[][] => {
  const totalPageArray = Array.from({ length: totalPage }, (_, i) => i + 1);
  return Array.from({ length: Math.ceil(totalPage / limit) }, () =>
    totalPageArray.splice(0, limit)
  );
};
