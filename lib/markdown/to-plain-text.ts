/**
 * Markdown → プレーンテキスト変換ユーティリティ
 * -----------------------------------------------
 * ・見出しを装飾して強調（# → 線や【見出し】形式）
 * ・箇条書き・番号付きリストを整形
 * ・太字・斜体・取り消し線をわかりやすく記号置換
 * ・コードブロックを囲んで強調
 * ・リンクや画像はURLを明示
 * ・表やチェックリストにも対応
 */

export function markdownToPlainText(markdown: string): string {
  let text = markdown;

  // --- コードブロック ---
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) => {
    const header = `──────── \`\`\`${lang ? `（${lang}）` : ''} \`\`\` ────────`;
    const footer = '──────────────────────────────';
    return `\n${header}\n${code.trim()}\n${footer}\n`;
  });

  // --- インラインコード ---
  text = text.replace(/`([^`]+)`/g, '`$1``');

  // --- 見出し ---
  text = text
    .replace(/^###### (.*)$/gm, '───── ● $1')
    .replace(/^##### (.*)$/gm, '──── ● $1')
    .replace(/^#### (.*)$/gm, '─── ● $1')
    .replace(/^### (.*)$/gm, '── ● $1')
    .replace(/^## (.*)$/gm, '■ $1')
    .replace(/^# (.*)$/gm, '──────────────\n ■ $1\n──────────────');

  // --- 太字・斜体・取り消し線 ---
  text = text
    .replace(/\*\*(.*?)\*\*/g, '【$1】') // 太字
    .replace(/\*(.*?)\*/g, '[$1]') // 斜体
    .replace(/~~(.*?)~~/g, '~$1~'); // 取り消し線

  // --- 引用 ---
  text = text.replace(/^> ?(.*)$/gm, '> $1');

  // --- チェックリスト ---
  text = text.replace(/- \[x\] (.*)/g, '☑ $1').replace(/- \[ \] (.*)/g, '☐ $1');

  // --- 番号付きリスト ---
  text = text.replace(
    /^(\s*)(\d+\.)\s+(.*)$/gm,
    (m, leadingSpaces, numPart, item) => `${leadingSpaces}${numPart} ${item}`
  );

  // --- 箇条書き ---
  text = text.replace(
    /^(\s*)[-*+]\s+(.*)$/gm,
    (m, leadingSpaces, item) => `${leadingSpaces}・${item}`
  );

  // --- テーブル ---
  text = text.replace(/^\|.*\|$/gm, (line) => {
    if (/^(\|[-:]+\|)+$/.test(line)) return '';
    return line
      .replace(/\|/g, ' | ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  });

  // --- 区切り線 ---
  text = text.replace(/^(-{3,}|\*{3,})$/gm, '──────────────');

  // --- リンク・画像 ---
  text = text
    .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s"([^"]+)")?\)/g, '$2 ($3)')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$2 ($1)');

  // --- HTMLタグの削除 ---
  text = text.replace(/<\/?[^>]+(>|$)/g, '');

  // --- 脚注 ---
  text = text.replace(/\[\^(\d+)\]: (.*)/g, '[^$1] $2').replace(/\[\^(\d+)\]/g, '[^$1]');

  // --- 余分な空行・スペースを整形 ---
  text = text
    .replace(/\n{3,}/g, '\n\n') // 3つ以上の連続改行を2つに
    .replace(/[ \t]+$/gm, '') // 行末の空白を削除
    .replace(/\n+$/, '') // 末尾の改行を削除
    .trim();

  return text;
}
