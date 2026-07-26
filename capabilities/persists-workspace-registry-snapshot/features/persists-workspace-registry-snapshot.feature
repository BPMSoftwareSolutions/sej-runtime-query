Feature: Persist workspace registry snapshot

  Scenario Outline: the complete registry snapshot is durably replaced and verified
    Given the persists-workspace-registry-snapshot request satisfies its input contract
    And the required observations have been reported through declared ports
    When the persists-workspace-registry-snapshot capability is invoked
    Then semantic authority resolves the declared outcome
    And the execution model runs only authorized operations
    And the projected receipt records the final disposition

    Examples:
      | posture | expected disposition |
      | authorized | WORKSPACE_REGISTRY_SNAPSHOT_PERSISTED |
      | rejected   | WORKSPACE_REGISTRY_SNAPSHOT_NOT_PERSISTED |
