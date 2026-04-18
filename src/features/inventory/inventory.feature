@smoke @regression
Feature: Inventory
  As a logged-in user
  I want to browse and sort products
  So that I can find items to purchase

  Background:
    Given I am logged in as "standard" user

  @smoke
  Scenario: Inventory page displays products
    Then I should see 6 products on the inventory page

  @regression
  Scenario: Sort products by price low to high
    When I sort products by "lohi"
    Then the products should be sorted by price ascending

  @regression
  Scenario: Sort products by name Z to A
    When I sort products by "za"
    Then the products should be sorted by name descending

  @smoke
  Scenario: Add a product to cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show 1

  @regression
  Scenario: Remove a product from cart
    When I add "Sauce Labs Backpack" to the cart
    And I remove "Sauce Labs Backpack" from the cart
    Then the cart badge should not be visible
