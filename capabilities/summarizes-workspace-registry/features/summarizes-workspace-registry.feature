Feature: Summarize workspace registry

  Scenario Outline: one deterministic workspace registry summary is projected
    Given the summarizes-workspace-registry request satisfies its input contract
    And the required observations have been reported through declared ports
    When the summarizes-workspace-registry capability is invoked
    Then semantic authority resolves the declared outcome
    And the execution model runs only authorized operations
    And the projected receipt records the final disposition

    Examples:
      | posture | expected disposition |
      | authorized | WORKSPACE_REGISTRY_SUMMARIZED |
      | rejected   | WORKSPACE_REGISTRY_SUMMARY_REJECTED |
