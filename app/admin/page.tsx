"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  service_id: string;
  name: string;
  phone: string;
  status: "pending" | "confirmed" | "cancelled";
};

function openWhatsAppMessage(booking: Booking, action: "confirmed" | "cancelled" | "deleted") {
  const phone = booking.phone.replace(/\D/g, "");
  const recipient = phone.startsWith("216") ? phone : `216${phone}`;
  const details = [
    `Date : ${booking.date}`,
    `Heure : ${booking.start_time} - ${booking.end_time}`,
    `Service : ${booking.service_id}`,
  ];
  const messages = {
    confirmed: [
      `Bonjour ${booking.name},`,
      "Bonne nouvelle ! Votre rendez-vous chez Habib Korbi est confirmé.",
      "",
      ...details,
      "",
      "Merci pour votre confiance. À bientôt !",
    ],
    cancelled: [
      `Bonjour ${booking.name},`,
      "Nous vous informons que votre rendez-vous chez Habib Korbi a été annulé.",
      "",
      ...details,
      "",
      "Pour choisir un autre créneau, veuillez effectuer une nouvelle réservation. Merci de votre compréhension.",
    ],
    deleted: [
      `Bonjour ${booking.name},`,
      "Votre réservation chez Habib Korbi a été supprimée de notre système.",
      "",
      ...details,
      "",
      "Si cette suppression n'était pas prévue, veuillez nous contacter. Merci.",
    ],
  };
  const message = messages[action].join("\n");
  window.open(`https://wa.me/${recipient}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

const statusLabel: Record<Booking["status"], string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filterOptions = useMemo(() => ({
    dates: [...new Set(bookings.map((booking) => booking.date))],
    services: [...new Set(bookings.map((booking) => booking.service_id))],
  }), [bookings]);
  const filteredBookings = useMemo(() => bookings.filter((booking) =>
    (!dateFilter || booking.date === dateFilter) &&
    (!serviceFilter || booking.service_id === serviceFilter) &&
    (!statusFilter || booking.status === statusFilter)
  ), [bookings, dateFilter, serviceFilter, statusFilter]);
  const clientCount = new Set(filteredBookings.map((booking) => booking.phone)).size;

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

  async function updateBooking(id: string, status: "confirmed" | "cancelled") {
    const booking = bookings.find((item) => item.id === id);
    if (!booking) return;
    setUpdating(id);
    setError("");
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.error ?? "Impossible de modifier la réservation.");
        return;
      }
      const result = await response.json();
      openWhatsAppMessage(booking, status);
      setBookings((current) => current.map((currentBooking) =>
        currentBooking.id === id ? { ...currentBooking, status: result.booking.status } : currentBooking
      ));
    } catch {
      setError("Impossible de modifier la réservation.");
    } finally {
      setUpdating(null);
    }
  }

  async function deleteBooking(id: string) {
    if (!window.confirm("Supprimer définitivement cette réservation ?")) return;
    const booking = bookings.find((item) => item.id === id);
    if (!booking) return;
    setUpdating(id);
    setError("");
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.error ?? "Impossible de supprimer la réservation.");
        return;
      }
      await response.json();
      openWhatsAppMessage(booking, "deleted");
      setBookings((current) => current.filter((booking) => booking.id !== id));
    } catch {
      setError("Impossible de supprimer la réservation.");
    } finally {
      setUpdating(null);
    }
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
          <>
            <div className="admin-stat">
              <span>Clients ayant réservé</span>
              <strong>{clientCount}</strong>
            </div>
            <div className="admin-filters" aria-label="Filtres des réservations">
              <label>
                Date
                <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
                  <option value="">Toutes les dates</option>
                  {filterOptions.dates.map((date) => <option key={date} value={date}>{date}</option>)}
                </select>
              </label>
              <label>
                Service
                <select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}>
                  <option value="">Tous les services</option>
                  {filterOptions.services.map((service) => <option key={service} value={service}>{service}</option>)}
                </select>
              </label>
              <label>
                Statut
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                </select>
              </label>
              {(dateFilter || serviceFilter || statusFilter) && (
                <button className="admin-filter-reset" type="button" onClick={() => {
                  setDateFilter("");
                  setServiceFilter("");
                  setStatusFilter("");
                }}>
                  Réinitialiser
                </button>
              )}
            </div>
          </>
        )}
        {!error && filteredBookings.length === 0 && <p>Aucune réservation pour ces filtres.</p>}
        {filteredBookings.length > 0 && (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Date</th><th>Heure</th><th>Service</th><th>Client</th><th>Téléphone</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>{filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.date}</td><td>{booking.start_time} - {booking.end_time}</td><td>{booking.service_id}</td>
                    <td>{booking.name}</td><td>{booking.phone}</td>
                    <td><span className={`admin-status ${booking.status}`}>{statusLabel[booking.status]}</span></td>
                    <td><BookingActions booking={booking} updating={updating} onUpdate={updateBooking} onDelete={deleteBooking} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="admin-mobile-bookings">
              {filteredBookings.map((booking) => (
                <article className="admin-booking-card" key={booking.id}>
                  <div><span>Date</span><strong>{booking.date}</strong></div>
                  <div><span>Heure</span><strong>{booking.start_time} - {booking.end_time}</strong></div>
                  <div><span>Service</span><strong>{booking.service_id}</strong></div>
                  <div><span>Client</span><strong>{booking.name}</strong></div>
                  <div><span>Téléphone</span><strong>{booking.phone}</strong></div>
                  <div><span>Statut</span><strong className={`admin-status ${booking.status}`}>{statusLabel[booking.status]}</strong></div>
                  <div className="admin-actions"><BookingActions booking={booking} updating={updating} onUpdate={updateBooking} onDelete={deleteBooking} /></div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function BookingActions({
  booking,
  updating,
  onUpdate,
  onDelete,
}: {
  booking: Booking;
  updating: string | null;
  onUpdate: (id: string, status: "confirmed" | "cancelled") => void;
  onDelete: (id: string) => void;
}) {
  const disabled = updating !== null;
  return (
    <div className="admin-actions">
      {booking.status === "pending" && (
        <>
          <button className="admin-action confirm" type="button" disabled={disabled} onClick={() => onUpdate(booking.id, "confirmed")}>
            {updating === booking.id ? "..." : "Confirmer"}
          </button>
          <button className="admin-action cancel" type="button" disabled={disabled} onClick={() => onUpdate(booking.id, "cancelled")}>
            Annuler
          </button>
        </>
      )}
      <button className="admin-action delete" type="button" disabled={disabled} onClick={() => onDelete(booking.id)}>
        Supprimer
      </button>
    </div>
  );
}
