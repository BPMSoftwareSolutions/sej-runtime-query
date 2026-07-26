Feature: Classify workspace JSON document

  Scenario Outline: one semantically classified registry document is projected
    Given the classifies-workspace-json-document request satisfies its input contract
    And the required observations have been reported through declared ports
    When the classifies-workspace-json-document capability is invoked
    Then semantic authority resolves the declared outcome
    And the execution model runs only authorized operations
    And the projected receipt records the final disposition

    Examples:
      | posture | expected disposition |
      | authorized | WORKSPACE_JSON_DOCUMENT_CLASSIFIED |
      | rejected   | WORKSPACE_JSON_DOCUMENT_INDETERMINATE |
