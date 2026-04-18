@smoke @regression
Feature: User Authentication
  As a user of SauceDemo
  I want to log in with valid credentials
  So that I can access the inventory

  Background:
    Given I am on the login page

  @smoke
  Scenario: Successful login with standard user
    When I log in as "standard" user
    Then I should see the inventory page

  @smoke
  Scenario: Login fails for locked out user
    When I log in as "locked" user
    Then I should see the error message "Epic sadface: Sorry, this user has been locked out."

  @regression
  Scenario: Login fails with invalid credentials
    When I enter username "invalid_user" and password "wrong_password"
    And I click the login button
    Then I should see the error message "Epic sadface: Username and password do not match any user in this service"

  @regression
  Scenario Outline: Multiple user roles can log in
    When I log in as "<role>" user
    Then I should see the inventory page

    Examples:
      | role        |
      | standard    |
      | problem     |
      | performance |
