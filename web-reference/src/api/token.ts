export class AccessTokenStore {
  private token: string | null = null;

  get(): string | null {
    return this.token;
  }
  set(value: string | null) {
    this.token = value;
  }
  clear() {
    this.token = null;
  }
}
export const accessTokenStore = new AccessTokenStore();
