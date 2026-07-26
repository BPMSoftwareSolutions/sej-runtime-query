Feature: Build workspace registry

  Scenario Outline: one current workspace registry snapshot is returned or atomically persisted
    Given the builds-workspace-registry request satisfies its input contract
    And the required observations have been reported through declared ports
    When the builds-workspace-registry capability is invoked
    Then semantic authority resolves the declared outcome
    And the execution model runs only authorized operations
    And the projected receipt records the final disposition

    Examples:
      | posture | expected disposition |
      | authorized | WORKSPACE_REGISTRY_BUILT |
      | rejected   | WORKSPACE_REGISTRY_BUILD_FAILED |
