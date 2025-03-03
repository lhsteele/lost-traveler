import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders main heading", () => {
  render(<App />);
  expect(screen.getByText("Vite + React")).toBeInTheDocument();
});
