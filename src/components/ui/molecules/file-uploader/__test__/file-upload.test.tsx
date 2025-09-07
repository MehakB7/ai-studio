import { render, screen, fireEvent } from "@testing-library/react";
import { FileUploader } from "@/components/ui/molecules/file-uploader";

describe("FileUploader", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      handleFileSelect: jest.fn(),
      handleDrop: jest.fn(),
      handleDragOver: jest.fn(),
      ...props,
    };

    render(<FileUploader {...defaultProps} />);
    return defaultProps;
  };

  it("should call handleFileSelect when a file is uploaded via input", () => {
    const { handleFileSelect } = setup();

    const input = screen.getByTestId("input-file") as HTMLInputElement;
    const file = new File(["hello"], "test.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleFileSelect).toHaveBeenCalled();
    expect(input.files?.[0]).toEqual(file);
    expect(input.files).toHaveLength(1);
  });

  it("should call handleDrop and handleDragOver when a file is dragged and dropped", () => {
    const { handleDrop, handleDragOver } = setup();

    const dropArea = screen.getByTestId("area-file-upload");
    const file = new File(["world"], "drop.jpg", { type: "image/jpeg" });

    fireEvent.dragOver(dropArea);
    expect(handleDragOver).toHaveBeenCalled();

    fireEvent.drop(dropArea, {
      dataTransfer: { files: [file] },
    });

    expect(handleDrop).toHaveBeenCalled();
  });

  it("should display an error message if error prop is provided", () => {
    setup({ error: "Invalid file type" });
    expect(screen.getByText("Invalid file type")).toBeInTheDocument();
  });

  it("should open file dialog when drop area is clicked", () => {
    setup();
    const dropArea = screen.getByTestId("area-file-upload");
    const input = screen.getByTestId("input-file");
    const clickSpy = jest.spyOn(input, "click");
    fireEvent.click(dropArea);
    expect(clickSpy).toHaveBeenCalled();
  });
});
