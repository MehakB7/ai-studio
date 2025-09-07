import React from "react";
import { render, screen } from "@testing-library/react";
import History from "../history";
import { STYLES } from "@/lib/config";

const mockHistory = [
  {
    id: "1",
    imageUrl: "https://example.com/image1.png",
    prompt: "A beautiful sunset",
    style: "cinematic",
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    imageUrl: "https://example.com/image2.png",
    prompt: "Mountain landscape",
    style: "editorial",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

describe("History Component", () => {
  it("should show correct date format", () => {
    render(<History history={mockHistory} loadFromHistory={jest.fn()} />);
    expect(screen.getByTestId("history-time-1").textContent).toMatch(
      /hour|minute|second/i,
    );
    expect(screen.getByTestId("history-time-2").textContent).toMatch(/day/i);
  });

  it("should show image, title and style tag", () => {
    render(<History history={mockHistory} loadFromHistory={jest.fn()} />);
    expect(screen.getByTestId("history-image-1")).toHaveAttribute(
      "src",
      mockHistory[0].imageUrl,
    );
    expect(screen.getByTestId("history-image-2")).toHaveAttribute(
      "src",
      mockHistory[1].imageUrl,
    );
    expect(screen.getByTestId("history-prompt-1")).toHaveTextContent(
      mockHistory[0].prompt,
    );
    expect(screen.getByTestId("history-prompt-2")).toHaveTextContent(
      mockHistory[1].prompt,
    );
    expect(screen.getByTestId("history-style-1")).toHaveTextContent(
      STYLES.find((s) => s.value === mockHistory[0].style)?.label || "",
    );
    expect(screen.getByTestId("history-style-2")).toHaveTextContent(
      STYLES.find((s) => s.value === mockHistory[1].style)?.label || "",
    );
  });

  it("should call loadFromHistory when image is clicked", () => {
    const mockLoadFromHistory = jest.fn();
    render(
      <History history={mockHistory} loadFromHistory={mockLoadFromHistory} />,
    );
    screen.getByTestId("history-image-1").click();
    expect(mockLoadFromHistory).toHaveBeenCalledWith(mockHistory[0]);
    screen.getByTestId("history-image-2").click();
    expect(mockLoadFromHistory).toHaveBeenCalledWith(mockHistory[1]);
    expect(mockLoadFromHistory).toHaveBeenCalledTimes(2);
  });

  it("should show 'No generations yet' message when history is empty", () => {
    render(<History history={[]} loadFromHistory={jest.fn()} />);
    expect(screen.getByText("No generations yet")).toBeInTheDocument();
  });
});
