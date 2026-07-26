Feature: Resolves authority by metadata

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid resolves-authority-by-metadata request
    And compatible semantic authority is registered
    When the resolves-authority-by-metadata capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-no-metadata-match | reject-no-metadata-match | AUTHORITY_RESOLVED_BY_METADATA |
      | match-any-declared-metadata | match-any-declared-metadata | AUTHORITY_RESOLVED_BY_METADATA |
      | match-all-declared-metadata | match-all-declared-metadata | AUTHORITY_RESOLVED_BY_METADATA |
