Feature: Resolve workspace registry request

  Scenario Outline: one immutable workspace registry request authority is resolved
    Given the resolves-workspace-registry-request request satisfies its input contract
    And the required observations have been reported through declared ports
    When the resolves-workspace-registry-request capability is invoked
    Then semantic authority resolves the declared outcome
    And the execution model runs only authorized operations
    And the projected receipt records the final disposition

    Examples:
      | posture | expected disposition |
      | authorized | WORKSPACE_REGISTRY_REQUEST_RESOLVED |
      | rejected   | WORKSPACE_REGISTRY_REQUEST_REJECTED |
