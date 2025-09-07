import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImagePromptForm } from "../form";

const mockOnSubmit = jest.fn();

function setup() {
  render(<ImagePromptForm onSubmit={mockOnSubmit} isGenerating={false} />);
}

describe("ImagePromptForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("should disable submit button when fields are empty", () => {
    setup();
    const submitBtn = screen.getByTestId("button-submit");
    expect(submitBtn).toBeDisabled();
  });

  it("should enable submit button when all fields are filled", async () => {
    setup();
    const file = new File([new Uint8Array(100)], "test.png", {
      type: "image/png",
    });
    const input = screen.getByTestId("input-file");
    fireEvent.change(input, { target: { files: [file] } });
    const promptInput = screen.getByTestId("prompt-input");
    fireEvent.change(promptInput, { target: { value: "A test prompt" } });
    await waitFor(() => {
      expect(screen.getByTestId("button-submit")).not.toBeDisabled();
    });
  });

  it("should update summary as user types and style changes", async () => {
    setup();
    const promptInput = screen.getByTestId("prompt-input");
    fireEvent.change(promptInput, { target: { value: "vintage" } });
    expect(screen.getByTestId("summary-prompt")).toHaveTextContent("vintage");
    const trigger = screen.getByTestId("style");
    fireEvent.click(trigger);
    const option = await screen.getByRole("option", { name: /Streetwear/i });
    fireEvent.click(option);
    expect(screen.getByTestId("summary-style")).toHaveTextContent(
      /Streetwear/i
    );
  });

  it("should show error if uploaded image is greater than 10MB", async () => {
    setup();

    const file = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.png", {
      type: "image/png",
    });

    const input = screen.getByTestId("input-file") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByTestId("upload-error")).toBeInTheDocument();
      expect(screen.getByText("Please upload an image smaller than 10MB")).toBeInTheDocument();
    });
  });
});
