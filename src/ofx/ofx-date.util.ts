import { addDays } from 'date-fns';

export class OfxDateUtil {
  public static DateToOfxDate(date: Date, adjustment?: number): string {
    if (adjustment) {
      date = addDays(date, adjustment);
    }
    const year = date.getFullYear();
    const month = this.addLeadingZero(date.getMonth() + 1);
    const day = this.addLeadingZero(date.getDate());
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
