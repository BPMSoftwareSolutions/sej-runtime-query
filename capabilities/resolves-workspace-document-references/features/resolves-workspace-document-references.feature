Feature: Resolve workspace document references

  Scenario Outline: stable reference evidence and dependency candidate roles are projected
    Given the resolves-workspace-document-references request satisfies its input contract
    And the required observations have been reported through declared ports
    When the resolves-workspace-document-references capability is invoked
    Then semantic authority resolves the declared outcome
    And the execution model runs only authorized operations
    And the projected receipt records the final disposition

    Examples:
      | posture | expected disposition |
      | authorized | WORKSPACE_DOCUMENT_REFERENCES_RESOLVED |
      | rejected   | WORKSPACE_DOCUMENT_REFERENCE_UNRESOLVED |
