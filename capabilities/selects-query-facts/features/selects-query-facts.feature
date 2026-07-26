Feature: Selects query facts

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid selects-query-facts request
    And compatible semantic authority is registered
    When the selects-query-facts capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | select-all-declared-facts | select-all-declared-facts | QUERY_FACTS_SELECTED |
      | select-named-facts | select-named-facts | QUERY_FACTS_SELECTED |
