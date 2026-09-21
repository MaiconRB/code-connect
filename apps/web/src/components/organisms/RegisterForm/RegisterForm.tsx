import { useState, type FC, type FormEvent } from "react";
import { ArrowRight, LogIn } from "lucide-react";
import { FormField } from "../../molecules/FormField/FormField";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { Link } from "../../atoms/Link/Link";
import { Button } from "../../atoms/Button/Button";
import { Divider } from "../../atoms/Divider/Divider";
import { SocialLoginGroup } from "../../molecules/SocialLoginGroup/SocialLoginGroup";

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormProps {
  onSubmit?: (values: RegisterFormValues) => void;
  onLoginClick?: () => void;
  onGithubLogin?: () => void;
  onGoogleLogin?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const RegisterForm: FC<RegisterFormProps> = ({
  onSubmit,
  onLoginClick,
  onGithubLogin,
  onGoogleLogin,
  isLoading = false,
  className = "",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Informe seu nome completo";
    }

    if (!email.trim()) {
      newErrors.email = "Informe seu e-mail";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Informe um e-mail válido";
    }

    if (!password) {
      newErrors.password = "Informe sua senha";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit?.({
      name: name.trim(),
      email: email.trim(),
      password,
      rememberMe,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col w-full max-w-sm mx-auto space-y-4 ${className}`.trim()}
      noValidate
    >
      <div className="space-y-3.5">
        <FormField
          id="name"
          label="Nome"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          error={errors.name}
          autoComplete="name"
        />

        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          error={errors.email}
          autoComplete="email"
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
          autoComplete="new-password"
        />
      </div>

      <div className="flex items-center justify-start pt-1">
        <Checkbox
          id="remember-me"
          label="Lembrar-me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
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
          Cadastrar
        </Button>
      </div>

      <Divider text="ou entre com outras contas" className="my-2" />

      <SocialLoginGroup
        onGithubClick={onGithubLogin}
        onGoogleClick={onGoogleLogin}
      />

      <div className="pt-2 text-center text-xs text-brand-muted space-y-1">
        <p>Já tem conta?</p>
        <div>
          <Link
            href="#login"
            variant="highlight"
            icon={<LogIn size={16} />}
            onClick={(e) => {
              e.preventDefault();
              onLoginClick?.();
            }}
          >
            Faça seu login!
          </Link>
        </div>
      </div>
    </form>
  );
};
