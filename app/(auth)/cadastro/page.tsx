"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  senha: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Inclua uma letra maiúscula")
    .regex(/[0-9]/, "Inclua um número"),
  oab: z.string().optional(),
  whatsapp: z.string().optional(),
  termos: z.literal(true, "Aceite os termos para continuar"),
});
type FormData = z.infer<typeof schema>;

function SenhaForca({ senha }: { senha: string }) {
  const checks = [
    { label: "8+ caracteres", ok: senha.length >= 8 },
    { label: "Maiúscula", ok: /[A-Z]/.test(senha) },
    { label: "Número", ok: /[0-9]/.test(senha) },
  ];
  if (!senha) return null;
  return (
    <div className="flex gap-3 mt-1.5">
      {checks.map(({ label, ok }) => (
        <span
          key={label}
          className={`flex items-center gap-1 text-xs ${ok ? "text-[#0F6E56]" : "text-muted-foreground"}`}
        >
          {ok ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
          {label}
        </span>
      ))}
    </div>
  );
}

function mascaraWhatsapp(v: string) {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

function mascaraOAB(v: string) {
  return v.toUpperCase().replace(/[^A-Z0-9/]/g, "").slice(0, 12);
}

export default function CadastroPage() {
  const router = useRouter();
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [senhaVal, setSenhaVal] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
        options: {
          data: {
            nome: data.nome,
            oab: data.oab ?? null,
            whatsapp: data.whatsapp ?? null,
          },
        },
      });
      if (error) throw error;
      toast.success("Conta criada! Verifique seu email para confirmar.");
      router.push("/gerar");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao criar conta";
      toast.error(
        msg.includes("already registered") ? "Este email já está cadastrado" : msg
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
        <div className="mb-8 text-center">
          <span className="text-2xl font-semibold tracking-brand text-[#0C447C]">
            JIADVOCA
          </span>
          <p className="mt-1 text-sm text-muted-foreground">
            7 dias grátis, sem cartão
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* nome */}
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" placeholder="Dr(a). João Silva" {...register("nome")} />
            {errors.nome && (
              <p className="text-xs text-destructive">{errors.nome.message}</p>
            )}
          </div>

          {/* email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* senha */}
          <div className="space-y-1.5">
            <Label htmlFor="senha">Senha</Label>
            <div className="relative">
              <Input
                id="senha"
                type={showSenha ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("senha", {
                  onChange: (e) => setSenhaVal(e.target.value),
                })}
              />
              <button
                type="button"
                onClick={() => setShowSenha((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <SenhaForca senha={senhaVal} />
            {errors.senha && (
              <p className="text-xs text-destructive">{errors.senha.message}</p>
            )}
          </div>

          {/* oab */}
          <div className="space-y-1.5">
            <Label htmlFor="oab">
              OAB{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="oab"
              placeholder="OAB/SP 123456"
              {...register("oab", {
                onChange: (e) => setValue("oab", mascaraOAB(e.target.value)),
              })}
            />
          </div>

          {/* whatsapp */}
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">
              WhatsApp{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="(11) 99999-9999"
              {...register("whatsapp", {
                onChange: (e) =>
                  setValue("whatsapp", mascaraWhatsapp(e.target.value)),
              })}
            />
          </div>

          {/* termos */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="termos"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-border accent-[#0C447C]"
              {...register("termos")}
            />
            <label htmlFor="termos" className="text-sm text-muted-foreground leading-snug">
              Aceito os{" "}
              <Link href="/termos" className="text-[#0C447C] hover:underline">
                termos de uso
              </Link>{" "}
              e{" "}
              <Link href="/privacidade" className="text-[#0C447C] hover:underline">
                política de privacidade
              </Link>
            </label>
          </div>
          {errors.termos && (
            <p className="text-xs text-destructive">{errors.termos.message}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0C447C] hover:bg-[#185FA5] text-white mt-2"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Criar conta e começar trial de 7 dias
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="text-[#0C447C] font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
