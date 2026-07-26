Feature: Projects each query row

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid projects-each-query-row request
    And compatible semantic authority is registered
    When the projects-each-query-row capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reverse-order | reverse | QUERY_ROWS_PROJECTED |
      | source-order | source | QUERY_ROWS_PROJECTED |
