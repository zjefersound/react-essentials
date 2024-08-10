import { Meta, StoryObj } from "@storybook/react";
import { SmartForm, SmartFormProps } from ".";
import { useSmartForm } from "./hooks/useSmartForm";
import { FieldConfig } from "../SmartField/types";

const meta: Meta<typeof SmartForm> = {
  title: "Form/SmartForm",
  component: SmartForm,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const mockOnSubmit = async (data: any) => {
  console.log("Form submitted:", data);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const fields: FieldConfig[] = [
  { id: "name", label: "Name", placeholder: "Enter your name", type: "text", required: true },
  { id: "email", label: "Email", placeholder: "Enter your email", type: "email", required: true },
];

export const SimpleForm: StoryObj<SmartFormProps> = {
  render: (args) => {
    const formState = useSmartForm({
      onSubmit: mockOnSubmit,
      fields,
    });
    return <SmartForm {...args} formState={formState} />;
  },
  args: {
    submitText: "Submit",
  },
};

export const LoadingState: StoryObj<SmartFormProps> = {
  render: (args) => {
    const formState = useSmartForm({
      onSubmit: mockOnSubmit,
      fields,
      loading: true,
    });
    return <SmartForm {...args} formState={formState} />;
  },
  args: {
    submitText: "Submit",
  },
};

export const WithValidationErrors: StoryObj<SmartFormProps> = {
  render: (args) => {
    const formState = useSmartForm({
      onSubmit: mockOnSubmit,
      fields: [
        {
          id: "name",
          label: "Name",
          placeholder: "Enter your name",
          type: "text",
          required: true,
          validations: [
            {
              rule: (value: string) => value.length >= 3,
              message: "Name must be at least 3 characters long",
            },
          ],
        },
        {
          id: "email",
          label: "Email",
          placeholder: "Enter your email",
          type: "email",
          required: true,
          validations: [
            {
              rule: (value: string) => /\S+@\S+\.\S+/.test(value),
              message: "Invalid email address",
            },
          ],
        },
      ],
    });
    return <SmartForm {...args} formState={formState} />;
  },
  args: {
    submitText: "Submit",
  },
};
