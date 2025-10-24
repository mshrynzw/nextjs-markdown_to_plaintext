import { z } from 'zod';

import { BaseEntitySchema, SettingsDataSchema, UUIDSchema } from './base';

// ================================
// 機能制御・通知関連型
// ================================

/**
 * 機能
 */
export const FeatureSchema = BaseEntitySchema.extend({
  /** 機能コード */
  feature_code: z.string(),
  /** 機能名 */
  feature_name: z.string(),
  /** 説明 */
  description: z.string().optional(),
  /** 対象タイプ */
  target_type: z.enum(['company', 'group', 'user']),
  /** 対象ID */
  target_id: UUIDSchema,
  /** 有効フラグ */
  is_enabled: z.boolean(),
  /** 設定 */
  settings: z.record(SettingsDataSchema),
});

// ================================
// 型定義のエクスポート
// ================================

export type Feature = z.infer<typeof FeatureSchema>;
