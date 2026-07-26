Feature: Parses query command

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid parses-query-command request
    And compatible semantic authority is registered
    When the parses-query-command capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | select-command | select-command | QUERY_COMMAND_PARSED |
      | describe-command | describe-command | QUERY_COMMAND_PARSED |
      | explain-command | explain-command | QUERY_COMMAND_PARSED |
