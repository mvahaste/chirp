import { ThemeSwitcher } from "./theme-switcher";

export default function Footer() {
  return (
    <footer className="mx-auto flex w-full items-center justify-center gap-6 pb-4 pt-8 text-center text-xs">
      <p>
        View the source code on{" "}
        <a
          href="https://github.com/mvahaste/chirp"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          GitHub
        </a>
      </p>
      <ThemeSwitcher />
    </footer>
  );
}
