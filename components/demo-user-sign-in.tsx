import { signInAction } from "@/app/actions";

export default function DemoUserSignIn() {
  return (
    <form className="mt-2 text-sm">
      <input
        name="email"
        value="demo@example.com"
        readOnly
        className="hidden"
      />
      <input name="password" value="password" readOnly className="hidden" />
      <p>
        Or try signing in with the{" "}
        <button className="font-medium underline" formAction={signInAction}>
          demo account
        </button>
        .
      </p>
    </form>
  );
}
