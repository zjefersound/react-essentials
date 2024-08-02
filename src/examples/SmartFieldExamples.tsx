import { useState } from "react";
import { SmartField } from "../components/form/SmartField";
import { FieldConfig, FormFields } from "../components/form/SmartField/types";
import { MdMailOutline } from "react-icons/md";
import { Checkbox } from "../components/form/Checkbox";
import { CheckLabel } from "../components/form/atoms/CheckLabel";

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
  {
    label: "Email",
    type: "email",
    id: "email",
    required: true,
    placeholder: "Enter your email",
    Icon: MdMailOutline,
    validations: [
      {
        rule: (value) => /\S+@\S+\.\S+/.test(value),
        message: "Email is invalid",
      },
    ],
  },
  {
    label: "Password",
    type: "password",
    id: "password",
    required: true,
    placeholder: "Enter your password",
    validations: [
      {
        rule: (value) => value.length >= 6,
        message: "Password must be at least 6 characters",
      },
    ],
  },
  {
    label: "Age",
    type: "number",
    id: "age",
    placeholder: "Enter your age",
    validations: [
      {
        rule: (value) => value >= 18,
        message: "You must be at least 18 years old",
      },
    ],
  },
  { label: "Birthday", type: "date", id: "birthday" },
  {
    label: "Gender",
    type: "radio",
    id: "gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
  },
  {
    label: "Subscription",
    type: "checkbox",
    id: "subscribe",
    checkLabel: "Subscribe to the newsletter",
  },
  {
    label: "Country",
    type: "select",
    placeholder: "Select the country",
    id: "country",
    fetchOptionsFromApi: true,
    options: [
      { label: "Brazil", value: "BR" },
      { label: "United States", value: "US" },
    ],
  },
  {
    label: "Comments",
    type: "textarea",
    id: "comments",
    placeholder: "Enter your comments",
  },
  {
    label: "Profile Picture",
    type: "file",
    id: "profilePicture",
    placeholder: "Drag & drop or select your profile picture",
    allowedFileTypes: ["image/*"],
    height: 200,
    width: 200,
  },
  {
    label: "Photos",
    type: "files",
    id: "photos",
    allowedFileTypes: ["image/*"],
  },
  { label: "Volume", type: "slider", id: "volume", step: 10 },
  {
    label: "Price between",
    type: "range",
    id: "priceBetween",
    step: 20,
    max: 1000,
  },
  { label: "Favorite Color", type: "color", id: "favcolor" },
  { label: "Meeting Time", type: "time", id: "meetingTime" },
  {
    label: "Phone Number",
    type: "tel",
    id: "phone",
    placeholder: "Enter your phone number",
  },
  {
    label: "Website",
    type: "url",
    id: "website",
    placeholder: "Enter your website URL",
  },
  {
    label: "Hobbies",
    type: "checkboxList",
    id: "hobbies",
    options: [
      { value: "reading", label: "Reading" },
      { value: "traveling", label: "Traveling" },
      { value: "cooking", label: "Cooking" },
    ],
  },
];
export function SmartFieldExamples() {
  const initialFormState = formFields.reduce((acc, field) => {
    if (field.type === "checkboxList" || field.type === "files") {
      acc[field.id] = [];
    } else if (field.type === "range") {
      acc[field.id] = [0, 0];
    } else if (field.type === "file") {
      acc[field.id] = null;
    } else if (field.type === "checkbox") {
      acc[field.id] = false;
    } else if (field.type === "currency") {
      acc[field.id] = 0;
    } else if (field.type === "slider") {
      acc[field.id] = 0;
    } else {
      acc[field.id] = "";
    }
    return acc;
  }, {} as FormFields);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState(initialFormState);
  return (
    <div className="p-8 space-y-4">
      <h1 className="font-bold">All Smart Fields</h1>
      <div className="flex border-b pb-4">
        <Checkbox checked={disabled} onChange={() => setDisabled(!disabled)} />
        <CheckLabel>Disabled all fields</CheckLabel>
      </div>
      {formFields.map((field) => (
        <SmartField
          key={field.id}
          errors={[]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChangeValue={(value: any, id) => {
            setData((d) => ({ ...d, [id]: value }));
          }}
          value={data[field.id]}
          disabled={disabled}
          config={field}
        />
      ))}

      <h2>Data:</h2>
      <pre className="bg-slate-800 text-slate-400 whitespace-pre-wrap p-4 rounded-md">
        const data = {JSON.stringify(data, undefined, 2)}
      </pre>
    </div>
  );
}
