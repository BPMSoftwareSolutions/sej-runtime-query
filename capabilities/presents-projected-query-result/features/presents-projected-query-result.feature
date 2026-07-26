Feature: Present projected query results through semantic layout authority

  Scenario Outline: Resolve presentation from declared semantic authority
    Given a projected result with presentation authority "<authority>"
    When the projected result is presented
    Then the presentation disposition is "<disposition>"
    And no layout is synthesized at runtime

    Examples:
      | authority                           | disposition            |
      | one promoted layout and one binding | QUERY_RESULT_PRESENTED |
      | no applicable promoted layout       | CANONICAL_JSON_RETURNED |
