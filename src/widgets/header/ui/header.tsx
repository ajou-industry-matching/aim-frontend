import { Button } from "@/shared/ui/button/button";

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}

export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
  <header>
    <div className="flex justify-between items-center border-b border-black/10 px-5 py-[15px] font-sans">
      <div>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block align-top"
        >
          <g fill="none" fillRule="evenodd">
            <path
              d="M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z"
              fill="#FFF"
            />
            <path
              d="M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z"
              fill="#555AB9"
            />
            <path
              d="M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z"
              fill="#91BAF8"
            />
          </g>
        </svg>
        <h1 className="inline-block align-top ml-2 my-[6px] font-bold text-[20px] leading-none">
          Acme
        </h1>
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-2 text-[14px] text-[var(--color-gray-900)]">
              Welcome, <b>{user.name}</b>!
            </span>
            <Button size="small" onClick={onLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button size="small" onClick={onLogin}>
              Log in
            </Button>
            <Button variant="primary" size="small" onClick={onCreateAccount}>
              Sign up
            </Button>
          </>
        )}
      </div>
    </div>
  </header>
);
