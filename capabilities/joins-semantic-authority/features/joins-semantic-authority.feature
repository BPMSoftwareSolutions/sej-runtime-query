Feature: Joins semantic authority

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid joins-semantic-authority request
    And compatible semantic authority is registered
    When the joins-semantic-authority capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-unjoinable-sources | reject-unjoinable-sources | SEMANTIC_AUTHORITY_JOINED |
      | left-outer-join | left-outer-join | SEMANTIC_AUTHORITY_JOINED |
      | inner-join | inner-join | SEMANTIC_AUTHORITY_JOINED |
