import {bindable} from 'aurelia-framework';

export class TestElement {

  @bindable() resource: string;

  public attached(): void {
    console.log('resource', this.resource);
  }
  
}
