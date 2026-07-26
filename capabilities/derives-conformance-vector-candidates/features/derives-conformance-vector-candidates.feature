Feature: Derives conformance vector candidates

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid derives-conformance-vector-candidates request
    And compatible semantic authority is registered
    When the derives-conformance-vector-candidates capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-underivable-declaration | reject-underivable-declaration | CONFORMANCE_CANDIDATES_DERIVED |
      | derive-per-projection-field | derive-per-projection-field | CONFORMANCE_CANDIDATES_DERIVED |
      | derive-per-decision-rule | derive-per-decision-rule | CONFORMANCE_CANDIDATES_DERIVED |
