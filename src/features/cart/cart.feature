@smoke @regression
Feature: Shopping Cart
  As a logged-in user
  I want to manage my cart
  So that I can review items before checkout

  Background:
    Given I am logged in as "standard" user

  @smoke
  Scenario: Cart shows added items
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    Then the cart should contain 1 item

  @regression
  Scenario: Remove item from cart
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I remove "Sauce Labs Backpack" from the cart page
    Then the cart should be empty

  @regression
  Scenario: Continue shopping from cart
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I click continue shopping
    Then I should be on the inventory page
