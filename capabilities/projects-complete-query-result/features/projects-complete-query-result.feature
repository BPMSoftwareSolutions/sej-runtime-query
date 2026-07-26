Feature: Projects complete query result

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid projects-complete-query-result request
    And compatible semantic authority is registered
    When the projects-complete-query-result capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-empty-required-result | reject-empty-required-result | QUERY_RESULT_PROJECTED |
      | project-complete-result | project-complete-result | QUERY_RESULT_PROJECTED |
