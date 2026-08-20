export type Rule = {
  pattern: string;
  owners: string[];
};

export function parseCodeowners(text: string): Rule[] {
  const rules: Rule[] = [];

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const parts = trimmed.split(/\s+/);
    const [pattern, ...owners] = parts;

    rules.push({ pattern, owners });
  }

  return rules;
}
