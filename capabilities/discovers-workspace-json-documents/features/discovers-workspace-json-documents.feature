Feature: Discover workspace JSON documents

  Scenario Outline: one deterministic ordered collection of JSON document paths is observed
    Given the discovers-workspace-json-documents request satisfies its input contract
    And the required observations have been reported through declared ports
    When the discovers-workspace-json-documents capability is invoked
    Then semantic authority resolves the declared outcome
    And the execution model runs only authorized operations
    And the projected receipt records the final disposition

    Examples:
      | posture | expected disposition |
      | authorized | WORKSPACE_JSON_DOCUMENTS_DISCOVERED |
      | rejected   | WORKSPACE_JSON_DISCOVERY_FAILED |
