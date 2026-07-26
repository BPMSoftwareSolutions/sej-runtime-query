Feature: Composes semantic authority

  Scenario Outline: Resolve <rule> under declared semantic authority
    Given a valid composes-semantic-authority request
    And compatible semantic authority is registered
    When the composes-semantic-authority capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | reject-conflicting-authority | reject-conflicting-authority | SEMANTIC_AUTHORITY_COMPOSED |
      | earlier-declaration-wins | earlier-declaration-wins | SEMANTIC_AUTHORITY_COMPOSED |
      | later-declaration-wins | later-declaration-wins | SEMANTIC_AUTHORITY_COMPOSED |
