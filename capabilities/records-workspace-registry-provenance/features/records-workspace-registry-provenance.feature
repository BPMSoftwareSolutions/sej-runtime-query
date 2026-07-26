Feature: Record workspace registry provenance

  Scenario Outline: one registry provenance record is projected
    Given the records-workspace-registry-provenance request satisfies its input contract
    And the required observations have been reported through declared ports
    When the records-workspace-registry-provenance capability is invoked
    Then semantic authority resolves the declared outcome
    And the execution model runs only authorized operations
    And the projected receipt records the final disposition

    Examples:
      | posture | expected disposition |
      | authorized | WORKSPACE_REGISTRY_PROVENANCE_RECORDED |
      | rejected   | WORKSPACE_REGISTRY_PROVENANCE_INCOMPLETE |
