Feature: Resolves query source

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid resolves-query-source request
    And compatible semantic authority is registered
    When the resolves-query-source capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | use-explicit-source | use-explicit-source | QUERY_SOURCE_RESOLVED |
      | use-workspace-default-source | use-workspace-default-source | QUERY_SOURCE_RESOLVED |
