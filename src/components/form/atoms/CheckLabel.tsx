export function CheckLabel(
  props: Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "className">
) {
  return (
    <label
      className="inline-flex h-6 align-top items-center text-slate-900 text-sm ml-2"
      {...props}
    />
  );
}
