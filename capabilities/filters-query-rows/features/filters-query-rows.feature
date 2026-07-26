Feature: Filters query rows

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid filters-query-rows request
    And compatible semantic authority is registered
    When the filters-query-rows capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-undeclared-predicate-operator | reject-undeclared-predicate-operator | QUERY_ROWS_FILTERED |
      | apply-declared-predicate | apply-declared-predicate | QUERY_ROWS_FILTERED |
      | pass-through-unfiltered | pass-through-unfiltered | QUERY_ROWS_FILTERED |
