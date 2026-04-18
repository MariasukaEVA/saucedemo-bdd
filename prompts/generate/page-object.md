# Generate Page Object

Generate a Page Object Model class for the saucedemo-bdd project.

## Context

- Page objects extend `BasePage` from `src/pages/base.page.ts`
- Locators MUST use `data-test` attributes only: `[data-test="element-name"]`
- Never use XPath, CSS classes, or text-based selectors
- Locators are getters returning strings
- Methods are async and use BasePage helpers: `click`, `fill`, `getText`, `isVisible`, `waitForVisible`, `navigate`, `count`, `selectOption`

## Page to Generate

[DESCRIBE THE PAGE OR PASTE HTML/URL]

## Instructions

1. Identify all interactive elements and their `data-test` attributes
2. Create getter properties for each locator
3. Create action methods that compose the getters
4. For dynamic selectors (e.g. per-item buttons), create methods that accept parameters and return selector strings
5. Keep methods focused — one action per method

## Output format

```typescript
import { BasePage } from './base.page';

export class MyPage extends BasePage {
  get myButton() { return '[data-test="my-button"]'; }
  get myInput()  { return '[data-test="my-input"]'; }

  dynamicButton(name: string): string {
    return `[data-test="button-${name.toLowerCase().replace(/\s+/g, '-')}"]`;
  }

  async doAction(): Promise<void> {
    await this.click(this.myButton);
  }
}
```

Save to: `src/pages/<name>.page.ts`
