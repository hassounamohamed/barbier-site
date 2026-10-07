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
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) router.push("/admin");
    else setError((await response.json()).error ?? "Connexion impossible");
    setLoading(false);
  }

  return (
    <main className="admin-page">
      <form className="admin-card" onSubmit={submit}>
        <p className="eyebrow">HABIB KORBI</p>
        <h1>Espace admin</h1>
        <p>Connecte-toi pour consulter les réservations.</p>
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
