Feature: Renders canonical query result

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid renders-canonical-query-result request
    And compatible semantic authority is registered
    When the renders-canonical-query-result capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | render-canonical-json | render-canonical-json | QUERY_RESULT_RENDERED |
      | render-row-table | render-row-table | QUERY_RESULT_RENDERED |
      | render-single-value | render-single-value | QUERY_RESULT_RENDERED |
