Feature: Projects language delegation shell

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid projects-language-delegation-shell request
    And compatible semantic authority is registered
    When the projects-language-delegation-shell capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-unsupported-target | reject-unsupported-target | DELEGATION_SHELL_PROJECTED |
      | project-declared-target-shell | project-declared-target-shell | DELEGATION_SHELL_PROJECTED |
