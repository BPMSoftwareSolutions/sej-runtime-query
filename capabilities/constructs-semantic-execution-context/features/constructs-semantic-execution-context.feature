Feature: Constructs semantic execution context

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid constructs-semantic-execution-context request
    And compatible semantic authority is registered
    When the constructs-semantic-execution-context capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-incomplete-context | reject-incomplete-context | EXECUTION_CONTEXT_CONSTRUCTED |
      | context-complete | context-complete | EXECUTION_CONTEXT_CONSTRUCTED |
