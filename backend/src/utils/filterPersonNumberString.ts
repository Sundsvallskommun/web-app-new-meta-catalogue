/**
 * Filter function to get rid of last 4 and century-digits
 * @param personNumber Filters personnumber of length, 8, 10 or 12 with or without "-"-separator
 * @returns filtered personnumber, 6 characters
 */
export const filterPersonNumberString = (personNumber: string) => {
  personNumber = personNumber.replace('-', '');
  if (personNumber.length === 12) return personNumber.substring(2, 8);
  if (personNumber.length === 10) return personNumber.substring(0, 6);
  if (personNumber.length === 8) return personNumber.substring(2, 8);
  return personNumber;
};
