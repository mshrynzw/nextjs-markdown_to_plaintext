import type { Company, User } from '@/schemas';

const familyNames = [
  { japanese: '山田', english: 'yamada' },
  { japanese: '佐藤', english: 'sato' },
  { japanese: '田中', english: 'tanaka' },
  { japanese: '鈴木', english: 'suzuki' },
  { japanese: '高橋', english: 'takahashi' },
  { japanese: '伊藤', english: 'ito' },
  { japanese: '渡辺', english: 'watanabe' },
  { japanese: '中村', english: 'nakamura' },
  { japanese: '小林', english: 'kobayashi' },
  { japanese: '加藤', english: 'kato' },
  { japanese: '吉田', english: 'yoshida' },
  { japanese: '山本', english: 'yamamoto' },
  { japanese: '松本', english: 'matsumoto' },
  { japanese: '井上', english: 'inoue' },
  { japanese: '木村', english: 'kimura' },
  { japanese: '林', english: 'hayashi' },
  { japanese: '清水', english: 'shimizu' },
  { japanese: '森', english: 'mori' },
  { japanese: '池田', english: 'ikeda' },
  { japanese: '橋本', english: 'hashimoto' },
  { japanese: '石川', english: 'ishikawa' },
  { japanese: '阿部', english: 'abe' },
  { japanese: '前田', english: 'maeda' },
  { japanese: '藤田', english: 'fujita' },
  { japanese: '岡田', english: 'okada' },
  { japanese: '長谷川', english: 'hasegawa' },
  { japanese: '村上', english: 'murakami' },
  { japanese: '近藤', english: 'kondo' },
  { japanese: '坂本', english: 'sakamoto' },
  { japanese: '斎藤', english: 'saito' },
];

const firstNames = [
  { japanese: '太郎', english: 'taro' },
  { japanese: '花子', english: 'hanako' },
  { japanese: '次郎', english: 'jiro' },
  { japanese: '美咲', english: 'misaki' },
  { japanese: '健一', english: 'kenichi' },
  { japanese: '由美', english: 'yumi' },
  { japanese: '直樹', english: 'naoki' },
  { japanese: '恵子', english: 'keiko' },
  { japanese: '和也', english: 'kazuya' },
  { japanese: '智子', english: 'tomoko' },
  { japanese: '大輔', english: 'daisuke' },
  { japanese: '真理', english: 'mari' },
  { japanese: '慎一', english: 'shinichi' },
  { japanese: '千尋', english: 'chihiro' },
  { japanese: '拓也', english: 'takuya' },
  { japanese: '麻衣', english: 'mai' },
  { japanese: '雄一', english: 'yuichi' },
  { japanese: '恵美', english: 'emiko' },
  { japanese: '正樹', english: 'masaki' },
  { japanese: '香織', english: 'kaori' },
  { japanese: '博之', english: 'hiroyuki' },
  { japanese: '裕子', english: 'yuko' },
  { japanese: '誠', english: 'makoto' },
  { japanese: '美穂', english: 'miho' },
  { japanese: '俊介', english: 'shunsuke' },
  { japanese: '直美', english: 'naomi' },
  { japanese: '修一', english: 'shuichi' },
  { japanese: '久美子', english: 'kumiko' },
  { japanese: '雅人', english: 'masato' },
  { japanese: '恵', english: 'megumi' },
];

const groups = [
  { id: '1', name: '総務課' },
  { id: '2', name: '営業課' },
  { id: '3', name: '開発課' },
  { id: '4', name: '人事課' },
  { id: '5', name: '経理課' },
  { id: '6', name: 'マーケティング課' },
  { id: '7', name: 'カスタマーサポート課' },
  { id: '8', name: '品質管理課' },
  { id: '9', name: '法務課' },
  { id: '10', name: 'IT課' },
];

const employeeTypes = [
  { id: '0', name: '正社員' },
  { id: '1', name: '契約社員' },
  { id: '2', name: 'パートタイム' },
];

const workTypes = [
  { id: '0', name: '通常勤務' },
  { id: '1', name: 'フレックス勤務' },
  { id: '2', name: 'リモートワーク' },
];

export function getInitialUsers(
  company: Company,
  adminRatio: number = 10,
  employeeCount: number
): User[] {
  const users: User[] = [];

  for (let i = 0; i < employeeCount; i++) {
    const familyNameData = familyNames[i % familyNames.length];
    const firstNameData = firstNames[i % firstNames.length];
    const group = groups[i % groups.length];
    const employeeType = employeeTypes[i % employeeTypes.length];
    const workType = workTypes[i % workTypes.length];

    // 管理者の割合に基づいてロールを決定
    const isAdmin = i === 0 || Math.random() < adminRatio / 100;
    const role = isAdmin ? 'admin' : 'member';

    // 基本給の範囲設定（25万円〜60万円、千円単位）
    const baseSalaryRanges = [250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000];
    const baseSalary = baseSalaryRanges[Math.floor(Math.random() * baseSalaryRanges.length)];

    // 通勤手当（0円、1万円、1.5万円、2万円）
    const commutingAllowanceOptions = [0, 10000, 15000, 20000];
    const commutingAllowance =
      Math.random() < 0.8
        ? commutingAllowanceOptions[Math.floor(Math.random() * commutingAllowanceOptions.length)]
        : 0;

    // 住宅手当（0円、1.5万円、2万円、2.5万円、3万円）
    const housingAllowanceOptions = [0, 15000, 20000, 25000, 30000];
    const housingAllowance =
      Math.random() < 0.6
        ? housingAllowanceOptions[Math.floor(Math.random() * housingAllowanceOptions.length)]
        : 0;

    // メールアドレスを生成（t.yamada@test.example.com形式）
    const companyCode = company.code.toLowerCase();
    const email = `${firstNameData.english.charAt(0)}.${familyNameData.english}@${companyCode}.example.com`;

    users.push({
      id: (i + 1).toString(),
      family_name: familyNameData.japanese,
      first_name: firstNameData.japanese,
      role: role,
      email: email,
      company: company,
      primary_group: group,
      employee_type: employeeType,
      work_type: workType,
      fixed_values: {
        // 1) 支給設定
        base_salary: baseSalary,
        payment_type: 'monthly' as const,
        standard_working_hours: 160,
        overtime_rate: Math.round((baseSalary / 160) * 1.25),
        overtime_multiplier: 1.25,
        fixed_overtime: {
          is_enabled: Math.random() < 0.3,
          hours: 20,
          excess_settlement: true,
        },
        commuting_allowance: {
          amount: commutingAllowance,
          tax_category:
            commutingAllowance > 15000 ? ('taxable' as const) : ('non_taxable' as const),
          route_memo: 'JR山手線 新宿〜渋谷',
        },
        housing_allowance: {
          amount: housingAllowance,
          tax_category: housingAllowance > 10000 ? ('taxable' as const) : ('non_taxable' as const),
        },
        custom_allowances: [
          {
            name: '資格手当',
            amount: Math.random() < 0.5 ? [5000, 10000, 15000][Math.floor(Math.random() * 3)] : 0,
            tax_category: 'taxable' as const,
          },
        ],
        payment_cycle: 'monthly' as const,
        cutoff_day: 25,
        payment_day: 10,
        rounding_method: 'round' as const,
        absence_deduction_method: '時間単価',

        // 2) 控除設定（保険・税）
        social_insurance: {
          health_insurance_rate: 0.05,
          employee_pension_rate: 0.0915,
          employment_insurance_rate: 0.005,
          health_insurance_type: '協会けんぽ',
          standard_remuneration_grade: Math.floor(Math.random() * 30) + 1,
        },
        income_tax_category: '甲' as const,
        dependents_count: Math.floor(Math.random() * 4),
        basic_deduction_applied: true,
        resident_tax_collection: 'special_collection' as const,
        resident_tax_monthly_amount: [15000, 18000, 20000, 22000, 25000][
          Math.floor(Math.random() * 5)
        ],
        custom_deductions: [
          {
            name: '社宅費',
            amount:
              Math.random() < 0.3 ? [20000, 30000, 40000, 50000][Math.floor(Math.random() * 4)] : 0,
          },
        ],

        // 3) 計算ルール
        amount_rounding: 'round' as const,
        time_rounding: 'floor' as const,
        paid_leave_deduction: '控除なし',
        night_shift_multiplier: 1.25,
        holiday_multiplier: 1.35,
        substitute_holiday_handling: '代休取得',
        overtime_calculation_precision: 2,
        minimum_wage_check: true,

        // 4) 支払設定
        bank_account: {
          bank_name: ['三菱UFJ銀行', '三井住友銀行', 'みずほ銀行', 'りそな銀行'][
            Math.floor(Math.random() * 4)
          ],
          branch_name: ['新宿支店', '渋谷支店', '品川支店', '横浜支店'][
            Math.floor(Math.random() * 4)
          ],
          account_type: '普通',
          account_number_masked: `****${Math.floor(Math.random() * 9000) + 1000}`,
        },
        payment_method: 'full_transfer' as const,
      },
    });
  }

  return users;
}
