Feature: Resolves query selected authority

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid resolves-query-selected-authority request
    And compatible semantic authority is registered
    When the resolves-query-selected-authority capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | select-by-identity | select-by-identity | SELECTED_AUTHORITY_RESOLVED |
      | reject-ambiguous-selection | reject-ambiguous-selection | SELECTED_AUTHORITY_RESOLVED |
      | select-by-declared-selector | select-by-declared-selector | SELECTED_AUTHORITY_RESOLVED |
