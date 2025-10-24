import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 数字を全角数字に変換する関数
 * @param num 変換する数値
 * @returns 全角数字の文字列
 */
export function toFullWidthNumber(num: number): string {
  return num.toString().replace(/[0-9]/g, (digit) => {
    return String.fromCharCode(digit.charCodeAt(0) + 0xfee0);
  });
}

/**
 * 数値を3桁カンマ区切りの文字列に変換する関数
 * @param num 変換する数値
 * @returns 3桁カンマ区切りの文字列
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString();
}
