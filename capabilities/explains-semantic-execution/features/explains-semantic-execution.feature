Feature: Explains semantic execution

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid explains-semantic-execution request
    And compatible semantic authority is registered
    When the explains-semantic-execution capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-absent-testimony | reject-absent-testimony | SEMANTIC_EXECUTION_EXPLAINED |
      | explain-full-step-testimony | explain-full-step-testimony | SEMANTIC_EXECUTION_EXPLAINED |
      | explain-decisions-only | explain-decisions-only | SEMANTIC_EXECUTION_EXPLAINED |
