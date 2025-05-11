// 3PLモデルCAT/IRTロジック（AI適性アセスメント用）
export interface Item {
  id: string;
  a: number;
  b: number;
  c: number;
}

export function getProbability(ability: number, item: Item): number {
  const { a, b, c } = item;
  return c + (1 - c) / (1 + Math.exp(-1.7 * a * (ability - b)));
}

export function getInformation(ability: number, item: Item): number {
  const p = getProbability(ability, item);
  const q = 1 - p;
  const { a, c } = item;
  return (
    (Math.pow(a, 2) * Math.pow(q / p, 2) * Math.pow(p - c, 2)) /
    Math.pow(1 - c, 2)
  );
}

export function selectNextItem(
  ability: number,
  items: Item[],
  answeredItems: Set<string>
): Item | null {
  let maxInfo = -Infinity;
  let selectedItem: Item | null = null;
  for (const item of items) {
    if (answeredItems.has(item.id)) continue;
    const info = getInformation(ability, item);
    if (info > maxInfo) {
      maxInfo = info;
      selectedItem = item;
    }
  }
  return selectedItem;
}

export function estimateAbility(
  responses: Map<string, boolean>,
  items: Map<string, Item>,
  minAbility = -3,
  maxAbility = 3,
  precision = 0.01
): number {
  let lowerBound = minAbility;
  let upperBound = maxAbility;
  let currentAbility = (lowerBound + upperBound) / 2;
  while (upperBound - lowerBound > precision) {
    const derivative = Array.from(responses.entries()).reduce(
      (sum, [itemId, correct]) => {
        const item = items.get(itemId)!;
        const p = getProbability(currentAbility, item);
        return (
          sum + (correct ? 1 / p : -1 / (1 - p)) * p * (1 - p) * 1.7 * item.a
        );
      },
      0
    );
    if (derivative > 0) {
      lowerBound = currentAbility;
    } else {
      upperBound = currentAbility;
    }
    currentAbility = (lowerBound + upperBound) / 2;
  }
  return currentAbility;
}

export class CATSession {
  private currentAbility: number = 0;
  private items: Map<string, Item>;
  private responses: Map<string, boolean> = new Map();
  private answeredItems: Set<string> = new Set();
  private standardError: number = Infinity;

  constructor(items: Item[], initialAbility = 0) {
    this.currentAbility = initialAbility;
    this.items = new Map(items.map((item) => [item.id, item]));
  }

  getNextItem(): Item | null {
    return selectNextItem(
      this.currentAbility,
      Array.from(this.items.values()),
      this.answeredItems
    );
  }

  processResponse(itemId: string, correct: boolean): void {
    this.responses.set(itemId, correct);
    this.answeredItems.add(itemId);
    this.currentAbility = estimateAbility(this.responses, this.items);
    this.calculateStandardError();
  }

  private calculateStandardError(): void {
    let totalInfo = 0;
    for (const [itemId] of this.responses) {
      const item = this.items.get(itemId)!;
      totalInfo += getInformation(this.currentAbility, item);
    }
    this.standardError = 1 / Math.sqrt(totalInfo);
  }

  shouldEndTest(maxItems = 20, targetSE = 0.3): boolean {
    return (
      this.answeredItems.size >= maxItems || this.standardError <= targetSE
    );
  }

  getFinalAbility(): number {
    return this.currentAbility;
  }
}
