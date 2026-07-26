Feature: Indexes workspace authority

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid indexes-workspace-authority request
    And compatible semantic authority is registered
    When the indexes-workspace-authority capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | index-explicit-paths | index-explicit-paths | WORKSPACE_AUTHORITY_INDEXED |
      | index-declared-roots | index-declared-roots | WORKSPACE_AUTHORITY_INDEXED |
