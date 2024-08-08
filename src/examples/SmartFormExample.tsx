import { FieldConfig, FormFields } from "../components/form/SmartField/types";
import { SmartForm } from "../components/form/SmartForm";

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
export function SmartFormExample() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="font-bold">Smart Form</h1>
      <SmartForm
        submitText="Send form"
        onSubmit={async (payload: FormFields) => {
          console.log(payload);
        }}
        fields={formFields}
        formOptions={{
          country: [
            { label: "Brazil", value: "BR" },
            { label: "United States", value: "US" },
          ],
        }}
      />
    </div>
  );
}
