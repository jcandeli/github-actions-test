import React from "react";
import { render } from "@testing-library/react";
import { Button } from ".";

it("should render a snapshot", () => {
  const { container } = render(<Button>Test Button</Button>);
  expect(container).toMatchSnapshot();
});
