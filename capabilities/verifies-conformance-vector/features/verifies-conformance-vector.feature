Feature: Verifies conformance vector

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid verifies-conformance-vector request
    And compatible semantic authority is registered
    When the verifies-conformance-vector capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | vector-not-executable | vector-not-executable | CONFORMANCE_VECTOR_VERIFIED |
      | vector-passed | vector-passed | CONFORMANCE_VECTOR_VERIFIED |
      | vector-failed | vector-failed | CONFORMANCE_VECTOR_VERIFIED |
