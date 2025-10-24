/**
 * 分を時間と分の形式に変換する
 * @param minutes 分
 * @returns "X時間Y分" の形式の文字列
 */
export function formatMinutesToHoursMinutes(minutes: number): string {
  if (minutes === 0) return '0時間0分';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}分`;
  }

  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }

  return `${hours}時間${remainingMinutes}分`;
}

/**
 * 分を時間の小数点形式に変換する
 * @param minutes 分
 * @returns 時間の小数点形式（例: 8.5時間）
 */
export function formatMinutesToDecimalHours(minutes: number): string {
  const hours = minutes / 60;
  return `${hours.toFixed(2)}時間`;
}

/**
 * 時間の小数点形式を分に変換する
 * @param decimalHours 時間の小数点形式（例: 8.5）
 * @returns 分
 */
export function convertDecimalHoursToMinutes(decimalHours: number): number {
  return Math.round(decimalHours * 60);
}

/**
 * 時間と分を分に変換する
 * @param hours 時間
 * @param minutes 分
 * @returns 分
 */
export function convertHoursAndMinutesToMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

/**
 * 分を時間と分のオブジェクトに変換する
 * @param minutes 分
 * @returns { hours: number, minutes: number }
 */
export function convertMinutesToHoursAndMinutes(minutes: number): {
  hours: number;
  minutes: number;
} {
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  };
}
