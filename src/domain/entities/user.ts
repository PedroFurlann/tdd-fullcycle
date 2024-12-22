export class User {
  private readonly id: string;
  private readonly name: string;

  constructor(id: string, name: string) {
    this.validateUserData(id, name);
    this.id = id;
    this.name = name;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  private validateUserData(id: string, name: string): void {
    if (!id) {
      throw new Error("O ID é obrigatório.");
    }

    if (!name) {
      throw new Error("O nome é obrigatório.");
    }
  }
}
