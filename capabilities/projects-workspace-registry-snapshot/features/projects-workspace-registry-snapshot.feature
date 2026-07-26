Feature: Project workspace registry snapshot

  Scenario Outline: one contract-valid workspace registry snapshot is projected
    Given the projects-workspace-registry-snapshot request satisfies its input contract
    And the required observations have been reported through declared ports
    When the projects-workspace-registry-snapshot capability is invoked
    Then semantic authority resolves the declared outcome
    And the execution model runs only authorized operations
    And the projected receipt records the final disposition

    Examples:
      | posture | expected disposition |
      | authorized | WORKSPACE_REGISTRY_SNAPSHOT_PROJECTED |
      | rejected   | WORKSPACE_REGISTRY_SNAPSHOT_INVALID |
