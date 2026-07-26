Feature: Executes selected semantic subgraph

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid executes-selected-semantic-subgraph request
    And compatible semantic authority is registered
    When the executes-selected-semantic-subgraph capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-unregistered-model | reject-unregistered-model | SEMANTIC_SUBGRAPH_EXECUTED |
      | execute-declared-model | execute-declared-model | SEMANTIC_SUBGRAPH_EXECUTED |
