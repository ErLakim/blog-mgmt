const data = [
  { name: "r" },
  { name: "b" },
  { name: "s" },
  { name: "k" },
  { name: "l" },
  { name: "su" },
];

const page = 4;
const limit = 2;
//offset pagination
const paginateData = (data, page, limit) =>
{
  const startIndex=(page-1)*limit;
  const endIndex= startIndex +limit;
  return data.slice(startIndex,endIndex);
};
  // data.slice((page - 1) * limit, page * limit).map(({ name }) => name);

const currentPageData = paginateData(data, page, limit);
console.log(currentPageData);
