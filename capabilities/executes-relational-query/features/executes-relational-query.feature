Feature: Execute an authorized relational query

  Scenario Outline: Resolve <rule> under declared relational authority
    Given a valid executes-relational-query request
    And caller-supplied named row sources
    When the executes-relational-query capability is invoked
    Then the declared outcome <outcome> is projected
    And the recorded disposition is <disposition>
    And a canonical receipt is produced

    Examples:
      | rule | outcome | disposition |
      | execute-authorized-relational-query | joins groups CTEs and projections execute | RELATIONAL_QUERY_EXECUTED |
      | reject-unparseable-relational-query | a parse finding is recorded | RELATIONAL_QUERY_REJECTED |
      | reject-unavailable-relational-source | missing source identities are recorded | RELATIONAL_QUERY_REJECTED |
