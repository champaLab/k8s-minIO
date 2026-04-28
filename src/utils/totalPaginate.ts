export const totalPaginate = async (totalPage: number | any, limitRowPerPage: number) => {
  let count = 1
  count = Math.ceil(Number(totalPage) / limitRowPerPage)
  return count
}
