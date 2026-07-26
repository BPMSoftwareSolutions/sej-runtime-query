Feature: Applies semantic policy overlay

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid applies-semantic-policy-overlay request
    And compatible semantic authority is registered
    When the applies-semantic-policy-overlay capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-loosening-overlay | reject-loosening-overlay | SEMANTIC_POLICY_OVERLAY_APPLIED |
      | apply-tightening-overlay | apply-tightening-overlay | SEMANTIC_POLICY_OVERLAY_APPLIED |
      | ignore-redundant-overlay | ignore-redundant-overlay | SEMANTIC_POLICY_OVERLAY_APPLIED |
