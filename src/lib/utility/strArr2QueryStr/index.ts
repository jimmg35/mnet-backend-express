
export const strArr2QueryStr = (value: string[]): string => {
  let countycode_str: string = value.join(',')
  countycode_str = countycode_str.replace(/,/g, "','")
  countycode_str = "'" + countycode_str + "'"
  return countycode_str
}
