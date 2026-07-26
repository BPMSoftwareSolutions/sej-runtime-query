Feature: Apply semantic projection

  Scenario Outline: Apply an explicitly governed projection to a canonical query result
    Given a canonical query-result envelope
    And projection authority for <projection_scope>
    And the declared source-path disposition is <source_path_disposition>
    When semantic projection is applied
    Then the projection disposition is <projection_disposition>
    And a canonical projection receipt is produced

    Examples:
      | projection_scope | source_path_disposition | projection_disposition |
      | each-row         | all-required-present    | QUERY_RESULT_PROJECTED |
      | complete-result  | all-required-present    | QUERY_RESULT_PROJECTED |
      | each-row         | required-path-missing   | QUERY_PROJECTION_REJECTED |
