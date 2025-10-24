import { z } from 'zod';

import { BaseEntitySchema, TimestampSchema, UUIDSchema } from './base';

/**
 * 通知
 */
export const NotificationSchema = BaseEntitySchema.extend({
  /** ユーザーID */
  user_id: UUIDSchema,
  /** 通知タイプ */
  type: z.enum(['info', 'warning', 'error', 'success']),
  /** タイトル */
  title: z.string(),
  /** メッセージ */
  message: z.string(),
  /** リンクURL */
  link_url: z.string().optional(),
  /** 優先度 */
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  /** 既読フラグ */
  is_read: z.boolean(),
  /** 既読日時 */
  read_at: TimestampSchema.optional(),
  /** 有効期限 */
  expires_at: TimestampSchema.optional(),
});

// ================================
// 型定義のエクスポート
// ================================
export type Notification = z.infer<typeof NotificationSchema>;
