Feature: Routes semantic command

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid routes-semantic-command request
    And compatible semantic authority is registered
    When the routes-semantic-command capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | route-select-command | selects-query-facts | SEMANTIC_COMMAND_ROUTED |
      | route-describe-command | indexes-workspace-authority | SEMANTIC_COMMAND_ROUTED |
      | route-explain-command | explains-semantic-execution | SEMANTIC_COMMAND_ROUTED |
