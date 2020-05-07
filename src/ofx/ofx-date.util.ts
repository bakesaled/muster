import { addDays } from 'date-fns';

export class OfxDateUtil {
  public static DateToOfxDate(date: Date, adjustment?: number): string {
    if (adjustment) {
      date = addDays(date, adjustment);
    }
    const year = date.getUTCFullYear();
    const month = this.addLeadingZero(date.getUTCMonth() + 1);
    const day = this.addLeadingZero(date.getUTCDate());
    return `${year}${month}${day}`;
  }

  private static addLeadingZero(
    number: string | number,
    targetLength: number = 2
  ): string {
    if (typeof number === 'number') {
      number = number.toString();
    }
    while (number.length < targetLength) {
      number = `0${number}`;
    }
    return number;
  }
}
