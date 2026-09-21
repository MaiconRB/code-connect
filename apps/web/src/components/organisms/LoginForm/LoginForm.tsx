import { useState, type FC, type FormEvent } from "react";
import { ArrowRight, ClipboardList } from "lucide-react";
import { FormField } from "../../molecules/FormField/FormField";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { Link } from "../../atoms/Link/Link";
import { Button } from "../../atoms/Button/Button";
import { Divider } from "../../atoms/Divider/Divider";
import { SocialLoginGroup } from "../../molecules/SocialLoginGroup/SocialLoginGroup";

export interface LoginFormValues {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void;
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;
  onGithubLogin?: () => void;
  onGoogleLogin?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const LoginForm: FC<LoginFormProps> = ({
  onSubmit,
  onForgotPasswordClick,
  onRegisterClick,
  onGithubLogin,
  onGoogleLogin,
  isLoading = false,
  className = "",
}) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      newErrors.identifier = "Informe seu e-mail ou nome de usuário";
    }
    if (!password) {
      newErrors.password = "Informe sua senha";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit?.({ identifier, password, rememberMe });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col w-full max-w-sm mx-auto space-y-4 ${className}`.trim()}
      noValidate
    >
      <div className="space-y-3.5">
        <FormField
          id="identifier"
          label="Email ou usuário"
          placeholder="usuario123"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (errors.identifier) {
              setErrors((prev) => ({ ...prev, identifier: undefined }));
            }
          }}
          error={errors.identifier}
          autoComplete="username"
        />

        <FormField
          id="password"
          label="Senha"
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          error={errors.password}
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <Checkbox
          id="remember-me"
          label="Lembrar-me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <Link
          href="#esqueci-senha"
          variant="muted"
          onClick={(e) => {
            e.preventDefault();
            onForgotPasswordClick?.();
          }}
        >
          Esqueci a senha
        </Link>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full font-bold shadow-md"
          isLoading={isLoading}
          rightIcon={<ArrowRight size={18} strokeWidth={2.5} />}
        >
          Login
        </Button>
      </div>

      <Divider text="ou entre com outras contas" className="my-2" />

      <SocialLoginGroup
        onGithubClick={onGithubLogin}
        onGoogleClick={onGoogleLogin}
      />

      <div className="pt-2 text-center text-xs text-brand-muted space-y-1">
        <p>Ainda não tem conta?</p>
        <div>
          <Link
            href="#cadastro"
            variant="highlight"
            icon={<ClipboardList size={16} />}
            onClick={(e) => {
              e.preventDefault();
              onRegisterClick?.();
            }}
          >
            Crie seu cadastro!
          </Link>
        </div>
      </div>
    </form>
  );
};

