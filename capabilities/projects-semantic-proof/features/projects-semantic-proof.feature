Feature: Projects semantic proof

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid projects-semantic-proof request
    And compatible semantic authority is registered
    When the projects-semantic-proof capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-incomplete-proof | reject-incomplete-proof | SEMANTIC_PROOF_PROJECTED |
      | proof-complete | proof-complete | SEMANTIC_PROOF_PROJECTED |
