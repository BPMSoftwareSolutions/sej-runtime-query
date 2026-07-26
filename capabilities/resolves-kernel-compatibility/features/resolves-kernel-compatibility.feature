Feature: Resolves kernel compatibility

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid resolves-kernel-compatibility request
    And compatible semantic authority is registered
    When the resolves-kernel-compatibility capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | kernel-incompatible-primitives | kernel-incompatible-primitives | KERNEL_COMPATIBILITY_RESOLVED |
      | kernel-incompatible-specification | kernel-incompatible-specification | KERNEL_COMPATIBILITY_RESOLVED |
      | kernel-compatible | kernel-compatible | KERNEL_COMPATIBILITY_RESOLVED |
