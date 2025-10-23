export const isEmptyString = (str: string | null | undefined): boolean => {
  return str == null || str.trim().length === 0;
}
