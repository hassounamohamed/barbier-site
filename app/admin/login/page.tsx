"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        signal: controller.signal,
      });
      window.clearTimeout(timeout);
      const result = await response.json().catch(() => null);
      if (response.ok) {
        router.push("/admin");
        return;
      }
      setError(result?.error ?? "Connexion impossible");
    } catch {
      setError("Le serveur ne répond pas. Réessaie dans quelques secondes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-page">
      <form className="admin-card" onSubmit={submit}>
        <p className="admin-kicker">ESPACE PRIVÉ</p>
        <h1>Espace admin</h1>
        <p className="admin-intro">Connecte-toi pour gérer les réservations de ton salon.</p>
        <label className="bk-f">
          <span>Mot de passe</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus />
        </label>
        {error && <p className="bk-err" role="alert">{error}</p>}
        <button className="btn p" type="submit" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
      </form>
    </main>
  );
}
