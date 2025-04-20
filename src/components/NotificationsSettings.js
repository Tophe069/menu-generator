import React, { useState, useEffect } from 'react';

const defaultTimes = {
  petitDej: '07:30',
  dejeuner: '12:30',
  diner: '19:30',
  courses: { day: 'samedi', time: '10:00' },
  bilan: { day: 'dimanche', time: '18:00' },
};

function requestPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

function scheduleNotification(label, time, message, day = null) {
  // Annule tout existant
  if (window[`notifTimeout_${label}`]) clearTimeout(window[`notifTimeout_${label}`]);
  if (label === 'courses') {
    // Rappel hebdomadaire
    const days = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
    const targetDay = days.indexOf(day);
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    const notifTime = new Date();
    notifTime.setHours(h, m, 0, 0);
    notifTime.setDate(now.getDate() + ((targetDay - now.getDay() + 7) % 7));
    if (notifTime < now) notifTime.setDate(notifTime.getDate() + 7);
    const delay = notifTime - now;
    window[`notifTimeout_${label}`] = setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message);
      }
      // Reprogramme pour la semaine suivante
      scheduleNotification(label, time, message, day);
    }, delay);
    return;
  }
  // Notifications quotidiennes classiques
  const [h, m] = time.split(':').map(Number);
  const now = new Date();
  const notifTime = new Date();
  notifTime.setHours(h, m, 0, 0);
  if (notifTime < now) notifTime.setDate(notifTime.getDate() + 1);
  const delay = notifTime - now;
  window[`notifTimeout_${label}`] = setTimeout(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message);
    }
    // Reprogramme pour le lendemain
    scheduleNotification(label, time, message);
  }, delay);
}

export default function NotificationsSettings() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('notifEnabled') === 'true');
  const [times, setTimes] = useState(() => {
    const saved = localStorage.getItem('notifTimes');
    return saved ? JSON.parse(saved) : defaultTimes;
  });

  useEffect(() => {
    if (enabled) {
      requestPermission();
      Object.entries(times).forEach(([label, time]) => {
        if (label === 'courses') {
          scheduleNotification('courses', time.time, 'Préparez votre liste de courses pour la semaine !', time.day);
        } else if (label === 'bilan') {
          scheduleNotification('bilan', time.time, bilanMessage(), time.day);
        } else {
          scheduleNotification(label, time, `C'est l'heure de préparer votre ${label === 'petitDej' ? 'petit-déjeuner' : label}`);
        }
      });

      // Pour le bilan, reprogrammer chaque semaine en recalculant le message
      if (times.bilan) {
        scheduleNotification('bilan', times.bilan.time, bilanMessage(), times.bilan.day);
      }
    } else {
      ['petitDej','dejeuner','diner','courses','bilan'].forEach(label => {
        if (window[`notifTimeout_${label}`]) clearTimeout(window[`notifTimeout_${label}`]);
      });
    }
    localStorage.setItem('notifEnabled', enabled);
    localStorage.setItem('notifTimes', JSON.stringify(times));
  }, [enabled, times]);

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Notifications et rappels</h3>
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => setEnabled(e.target.checked)}
        />
        Activer les rappels pour les repas
      </label>
      {enabled && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            {Object.entries(times).filter(([label]) => label !== 'courses' && label !== 'bilan').map(([label, time]) => (
              <div key={label} className="flex flex-col">
                <span className="font-semibold mb-1">{label === 'petitDej' ? 'Petit-déjeuner' : label.charAt(0).toUpperCase() + label.slice(1)}</span>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTimes(t => ({ ...t, [label]: e.target.value }))}
                  className="border rounded px-2 py-1"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={!!times.courses}
              onChange={e => {
                setTimes(t => e.target.checked ? { ...t, courses: defaultTimes.courses } : (() => { const { courses, ...rest } = t; return rest; })());
              }}
            />
            <span className="font-semibold">Activer le rappel hebdomadaire pour les courses</span>
            {times.courses && (
              <>
                <select
                  value={times.courses.day}
                  onChange={e => setTimes(t => ({ ...t, courses: { ...t.courses, day: e.target.value } }))}
                  className="border rounded px-2 py-1 ml-2"
                >
                  {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(d => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={times.courses.time}
                  onChange={e => setTimes(t => ({ ...t, courses: { ...t.courses, time: e.target.value } }))}
                  className="border rounded px-2 py-1 ml-2"
                />
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={!!times.bilan}
              onChange={e => {
                setTimes(t => e.target.checked ? { ...t, bilan: defaultTimes.bilan } : (() => { const { bilan, ...rest } = t; return rest; })());
              }}
            />
            <span className="font-semibold">Activer le rappel hebdomadaire pour le bilan nutritionnel</span>
            {times.bilan && (
              <>
                <select
                  value={times.bilan.day}
                  onChange={e => setTimes(t => ({ ...t, bilan: { ...t.bilan, day: e.target.value } }))}
                  className="border rounded px-2 py-1 ml-2"
                >
                  {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(d => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={times.bilan.time}
                  onChange={e => setTimes(t => ({ ...t, bilan: { ...t.bilan, time: e.target.value } }))}
                  className="border rounded px-2 py-1 ml-2"
                />
              </>
            )}
          </div>
        </>
      )}
      <button
        className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
        onClick={() => {
          requestPermission();
          if (enabled) {
            Object.entries(times).forEach(([label, time]) => {
              scheduleNotification(label, time, `C'est l'heure de préparer votre ${label === 'petitDej' ? 'petit-déjeuner' : label}`);
            });
            alert('Notifications programmées !');
          }
        }}
      >
        Tester les notifications
      </button>
      <div className="text-xs text-gray-500 mt-2">
        Les notifications fonctionnent sur la plupart des navigateurs récents. L’application doit rester ouverte en arrière-plan pour que les rappels soient reçus.
      </div>
    </div>
  );
}
