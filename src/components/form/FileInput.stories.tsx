import type { Meta, StoryObj } from "@storybook/react";
import { FileInput } from "./FileInput";
import { fn } from "@storybook/test";

const meta = {
  title: "Form/FileInput",
  component: FileInput.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    children: [
      <FileInput.Dropzone>
        <FileInput.Input name="photos" files={[]} onFilesChange={fn()} />
      </FileInput.Dropzone>,
    ],
  },
} as Meta<typeof FileInput.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithList: Story = {
  args: {
    children: [
      <FileInput.Dropzone>
        <FileInput.Input name="photos" files={[]} onFilesChange={fn()} />
      </FileInput.Dropzone>,
      <FileInput.List
        files={[
          { dataURL: "", name: "file.jpg", size: 10330, type: "image/jpg" },
          { dataURL: "", name: "file 2.jpg", size: 79330, type: "image/jpg" },
        ]}
        onFilesChange={fn()}
        onFileRemove={(file) => {
          console.log("Removed file:", file);
        }}
      />,
    ],
  },
};

export const WithPreview: Story = {
  args: {
    children: [
      <FileInput.Dropzone height={200}>
        <FileInput.Input name="photos" files={[]} onFilesChange={fn()} />
        <FileInput.Preview visible onRemove={fn()}>
          <FileInput.FilePreview
            file={{
              dataURL:
                "https://images.unsplash.com/photo-1593273786530-442d90c90dbd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              name: "file.jpg",
              size: 10330,
              type: "image/jpg",
            }}
          />
        </FileInput.Preview>
      </FileInput.Dropzone>,
    ],
  },
};

export const WithError: Story = {
  args: {
    children: [
      <FileInput.Dropzone color="danger">
        <FileInput.Input name="photos" files={[]} onFilesChange={fn()} />
      </FileInput.Dropzone>,
    ],
  },
};

export const WithSuccess: Story = {
  args: {
    children: [
      <FileInput.Dropzone color="success">
        <FileInput.Input name="photos" files={[]} onFilesChange={fn()} />
      </FileInput.Dropzone>,
    ],
  },
};
