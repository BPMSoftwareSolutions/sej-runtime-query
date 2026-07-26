Feature: Chains semantic results

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid chains-semantic-results request
    And compatible semantic authority is registered
    When the chains-semantic-results capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | chain-compatible-contracts | chain-compatible-contracts | SEMANTIC_RESULTS_CHAINED |
      | reject-incompatible-chain | reject-incompatible-chain | SEMANTIC_RESULTS_CHAINED |
