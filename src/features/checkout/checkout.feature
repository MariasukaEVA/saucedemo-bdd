@smoke @regression
Feature: Checkout
  As a logged-in user
  I want to complete a purchase
  So that I can buy products from SauceDemo

  Background:
    Given I am logged in as "standard" user
    And I have added "Sauce Labs Backpack" to the cart
    And I am on the cart page

  @smoke
  Scenario: Complete a full checkout
    When I proceed to checkout
    And I fill in checkout info with first name "John" last name "Doe" postal code "12345"
    And I continue to the order overview
    Then I should see the order summary
    When I finish the order
    Then I should see the order confirmation

  @regression
  Scenario: Checkout fails with missing first name
    When I proceed to checkout
    And I fill in checkout info with first name "" last name "Doe" postal code "12345"
    And I continue to the order overview
    Then I should see the checkout error "Error: First Name is required"

  @regression
  Scenario: Checkout fails with missing postal code
    When I proceed to checkout
    And I fill in checkout info with first name "John" last name "Doe" postal code ""
    And I continue to the order overview
    Then I should see the checkout error "Error: Postal Code is required"
