import { useState } from "react";
import { SmartField } from "./components/form/SmartField";
import { IValidationError } from "./models/IValidationReturn";

interface IBoilerplateForm {
  name: string;
  email: string;
  language: string;
}
function App() {
  const [data, setData] = useState<IBoilerplateForm>({} as IBoilerplateForm);
  const errors: IValidationError[] = [];
  const handleChangeValue = (value: unknown, id: string) => {
    setData((d) => ({ ...d, [id]: value }));
  };
  return (
    <div className="bg-slate-100 p-4 mx-auto mt-8  rounded-md w-[500px]">
      <pre>{JSON.stringify(data)}</pre>
      <h1>Hello Dev</h1>

      <h2>Form</h2>
      <form className="mt-4 space-y-4">
        <SmartField
          onChangeValue={handleChangeValue}
          value={data["name"]}
          errors={errors}
          field={{
            type: "text",
            id: "name",
            label: "Name",
            placeholder: "Type your name",
            required: true,
          }}
        />
        <SmartField
          onChangeValue={handleChangeValue}
          value={data["email"]}
          errors={errors}
          field={{
            type: "text",
            id: "email",
            label: "Email",
            placeholder: "Type your email",
            required: true,
          }}
        />
        <SmartField
          onChangeValue={handleChangeValue}
          value={data["language"]}
          errors={errors}
          field={{
            type: "select",
            id: "language",
            label: "Language",
            placeholder: "Select the language",
            required: true,
            options: [
              { label: "English", value: "EN" },
              { label: "Português", value: "PT" },
            ],
          }}
        />
      </form>
    </div>
  );
}

export default App;
