import { useEffect, useState } from "react";
import { FieldConfig, FormFields } from "../components/form/SmartField/types";
import { SmartForm } from "../components/form/SmartForm";
import { ISelectOption } from "../models/ISelectOption";
import { useToast } from "../hooks/useToast";
import { ToastProvider } from "../contexts/ToastContext";

const formFields: FieldConfig[] = [
  {
    label: "Name",
    type: "text",
    id: "name",
    required: true,
    placeholder: "Enter your name",
    validations: [
      { rule: (value) => value.trim() !== "", message: "Name is required" },
    ],
  },
  {
    label: "Amount",
    type: "currency",
    id: "amount",
    required: true,
    placeholder: "Enter the amount",
    currency: "USD",
    locale: "en-US",
    validations: [
      {
        rule: (value) => value > 0,
        message: "Amount should be more than zero",
      },
    ],
  },
  { label: "Birthday", type: "date", id: "birthday", required: true },
  {
    label: "Gender",
    type: "radio",
    id: "gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
    required: true,
  },
  {
    label: "Country",
    type: "select",
    placeholder: "Select the country",
    id: "country",
    fetchOptionsFromApi: true,
    required: true,
  },
  {
    label: "Profile Picture",
    type: "file",
    id: "profilePicture",
    placeholder: "Drag & drop or select your profile picture",
    allowedFileTypes: ["image/*"],
    height: 200,
    width: 200,
    required: true,
  },
];

async function getCountries() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return Promise.resolve({
    data: [
      { label: "Brazil", value: "BR" },
      { label: "United States", value: "US" },
    ],
  });
}

async function successfulRequest(payload: FormFields) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return Promise.resolve({
    data: {
      message: "Form was submitted successfully",
      payload,
    },
  });
}
function SmartFormUnderToastExample() {
  const { launchToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [countryOptions, setCountryOptions] = useState<ISelectOption[]>([]);
  const handleSubmit = async (payload: FormFields) => {
    return successfulRequest(payload).then((response) => {
      launchToast({
        title: "Success",
        description: response.data.message,
        color: "success",
      });
    });
  };

  useEffect(() => {
    getCountries()
      .then((response) => setCountryOptions(response.data))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formOptions = {
    country: countryOptions,
  };
  return (
    <div className="p-8 space-y-4">
      <h1 className="font-bold">Smart Form</h1>
      <SmartForm
        submitText="Send form"
        onSubmit={handleSubmit}
        fields={formFields}
        formOptions={formOptions}
        loading={loading}
      />
    </div>
  );
}

export function SmartFormExample() {
  return (
    <ToastProvider>
      <SmartFormUnderToastExample />
    </ToastProvider>
  );
}
