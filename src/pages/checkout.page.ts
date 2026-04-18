import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  // Step 1 — info
  get firstNameInput()  { return '[data-test="firstName"]'; }
  get lastNameInput()   { return '[data-test="lastName"]'; }
  get postalCodeInput() { return '[data-test="postalCode"]'; }
  get continueButton()  { return '[data-test="continue"]'; }
  get cancelButton()    { return '[data-test="cancel"]'; }
  get errorMessage()    { return '[data-test="error"]'; }

  // Step 2 — overview
  get summaryItems()       { return '[data-test="inventory-item"]'; }
  get summaryItemNames()   { return '[data-test="inventory-item-name"]'; }
  get subtotalLabel()      { return '[data-test="subtotal-label"]'; }
  get taxLabel()           { return '[data-test="tax-label"]'; }
  get totalLabel()         { return '[data-test="total-label"]'; }
  get finishButton()       { return '[data-test="finish"]'; }

  // Step 3 — complete
  get completeHeader()  { return '[data-test="complete-header"]'; }
  get completeText()    { return '[data-test="complete-text"]'; }
  get backHomeButton()  { return '[data-test="back-to-products"]'; }

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  async continue(): Promise<void> {
    await this.click(this.continueButton);
  }

  async finish(): Promise<void> {
    await this.click(this.finishButton);
  }

  async getTotal(): Promise<string> {
    return this.getText(this.totalLabel);
  }

  async getCompleteHeader(): Promise<string> {
    return this.getText(this.completeHeader);
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }
}
