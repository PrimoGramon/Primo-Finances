import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-2xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition"
    />
  );
}