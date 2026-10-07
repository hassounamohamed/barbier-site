"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  service_id: string;
  name: string;
  phone: string;
  status: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const clientCount = new Set(bookings.map((booking) => booking.phone)).size;

  useEffect(() => {
    let active = true;
    const loadBookings = async () => {
      const response = await fetch("/api/admin/bookings");
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) {
        if (active) setError("Impossible de charger les réservations.");
        return;
      }
      const nextBookings = (await response.json()).bookings;
      if (active) {
        setBookings(nextBookings);
        setError("");
      }
    };

    loadBookings().catch(() => {
      if (active) setError("Impossible de charger les réservations.");
    });
    const refreshTimer = window.setInterval(() => {
      loadBookings().catch(() => {
        if (active) setError("Impossible de charger les réservations.");
      });
    }, 60_000);

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <main className="admin-page">
      <section className="admin-card admin-list">
        <div className="admin-heading">
          <div><p className="eyebrow">HABIB KORBI</p><h1>Réservations</h1></div>
          <button className="btn s" type="button" onClick={logout}>Déconnexion</button>
        </div>
        {error && <p className="bk-err" role="alert">{error}</p>}
        {!error && (
          <div className="admin-stat">
            <span>Clients ayant réservé</span>
            <strong>{clientCount}</strong>
          </div>
        )}
        {!error && bookings.length === 0 && <p>Aucune réservation.</p>}
        {bookings.length > 0 && (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Date</th><th>Heure</th><th>Service</th><th>Client</th><th>Téléphone</th><th>Statut</th></tr></thead>
                <tbody>{bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.date}</td><td>{booking.start_time} - {booking.end_time}</td><td>{booking.service_id}</td>
                    <td>{booking.name}</td><td>{booking.phone}</td><td>{booking.status}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="admin-mobile-bookings">
              {bookings.map((booking) => (
                <article className="admin-booking-card" key={booking.id}>
                  <div><span>Date</span><strong>{booking.date}</strong></div>
                  <div><span>Heure</span><strong>{booking.start_time} - {booking.end_time}</strong></div>
                  <div><span>Service</span><strong>{booking.service_id}</strong></div>
                  <div><span>Client</span><strong>{booking.name}</strong></div>
                  <div><span>Téléphone</span><strong>{booking.phone}</strong></div>
                  <div><span>Statut</span><strong>{booking.status}</strong></div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
