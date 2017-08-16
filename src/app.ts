export class App {
  public testData: Array<string>;

  constructor() {
    this.testData = new Array<string>();

    for (let i = 0; i < 2000; i++) {
      this.testData.push(this.getRNGString());
    }
  }

  private getRNGString(): string {
    const nextRandomNumber: number = Math.random();
    const stringLength = Math.floor(nextRandomNumber * 20);
    let randomString: string = '';

    for (let i = 0; i < stringLength; i++) {
      const nextCharacter: string = Math.random() + '';
      randomString = randomString + nextCharacter;
    }

    return randomString;
  }

}
