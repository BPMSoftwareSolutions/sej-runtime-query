Feature: Lints semantic authority

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid lints-semantic-authority request
    And compatible semantic authority is registered
    When the lints-semantic-authority capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | blocking-defect | blocking-defect | SEMANTIC_AUTHORITY_LINTED |
      | advisory-defect | advisory-defect | SEMANTIC_AUTHORITY_LINTED |
      | no-defect | no-defect | SEMANTIC_AUTHORITY_LINTED |
