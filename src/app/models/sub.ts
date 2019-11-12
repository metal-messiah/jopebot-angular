export class Sub {
  gift?: boolean;
  tier?: number;
  plan?: string;

  constructor(obj: Sub) {
    Object.assign(this, obj);
  }
}
