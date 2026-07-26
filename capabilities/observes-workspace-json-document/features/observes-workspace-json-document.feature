Feature: Observe workspace JSON document

  Scenario Outline: one immutable document observation is produced
    Given the observes-workspace-json-document request satisfies its input contract
    And the required observations have been reported through declared ports
    When the observes-workspace-json-document capability is invoked
    Then semantic authority resolves the declared outcome
    And the execution model runs only authorized operations
    And the projected receipt records the final disposition

    Examples:
      | posture | expected disposition |
      | authorized | WORKSPACE_JSON_DOCUMENT_OBSERVED |
      | rejected   | WORKSPACE_JSON_DOCUMENT_UNREADABLE |
