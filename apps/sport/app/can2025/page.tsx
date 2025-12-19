'use client';

import { useEffect, useState } from 'react';
import { Trophy, Calendar, Users } from 'lucide-react';

export default function CAN2025Page() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2025-12-21T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const algerieMatches = [
    {
      opponent: 'Guinée Équatoriale',
      date: '2025-12-21',
      time: '21:00',
      location: 'Stade Mohammed V, Casablanca',
    },
    {
      opponent: 'Burkina Faso',
      date: '2025-12-25',
      time: '18:00',
      location: 'Stade Prince Moulay Abdellah, Rabat',
    },
    {
      opponent: 'Mauritanie',
      date: '2025-12-29',
      time: '21:00',
      location: 'Stade de Marrakech',
    },
  ];

  return (
    <div className="py-8">
      {/* Hero */}
      <section className="hero-gradient text-white py-16 mb-8">
        <div className="container-app text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            🏆 CAN 2025 - Maroc
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-2">
            Coupe d'Afrique des Nations
          </p>
          <p className="text-lg opacity-75">21 Décembre 2025 - 18 Janvier 2026</p>
        </div>
      </section>

      {/* Countdown */}
      <section className="container-app mb-12">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-6">
            ⏱️ Compte à Rebours
          </h2>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="bg-primary text-white text-5xl font-bold rounded-lg p-6 mb-2">
                {countdown.days}
              </div>
              <div className="text-slate-600 dark:text-slate-400">Jours</div>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white text-5xl font-bold rounded-lg p-6 mb-2">
                {countdown.hours}
              </div>
              <div className="text-slate-600 dark:text-slate-400">Heures</div>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white text-5xl font-bold rounded-lg p-6 mb-2">
                {countdown.minutes}
              </div>
              <div className="text-slate-600 dark:text-slate-400">Minutes</div>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white text-5xl font-bold rounded-lg p-6 mb-2">
                {countdown.seconds}
              </div>
              <div className="text-slate-600 dark:text-slate-400">Secondes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Algérie Matchs */}
      <section className="container-app mb-12">
        <div className="flex items-center justify-center mb-6">
          <Trophy className="w-8 h-8 text-primary mr-2" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Matchs de l'Algérie 🇩🇿
          </h2>
        </div>

        <div className="space-y-4">
          {algerieMatches.map((match, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-primary/20 hover:border-primary transition-colors"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Algérie 🇩🇿 vs {match.opponent}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Groupe E - Phase de Poules
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(match.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                      })}{' '}
                      - {match.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{match.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Groupe E */}
      <section className="container-app">
        <div className="flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-primary mr-2" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Groupe E
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-slate-900 dark:text-white">
                  Pos
                </th>
                <th className="px-6 py-3 text-left text-slate-900 dark:text-white">
                  Équipe
                </th>
                <th className="px-6 py-3 text-center text-slate-900 dark:text-white">
                  J
                </th>
                <th className="px-6 py-3 text-center text-slate-900 dark:text-white">
                  V
                </th>
                <th className="px-6 py-3 text-center text-slate-900 dark:text-white">
                  N
                </th>
                <th className="px-6 py-3 text-center text-slate-900 dark:text-white">
                  D
                </th>
                <th className="px-6 py-3 text-center text-slate-900 dark:text-white">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {[
                { pos: 1, team: '🇩🇿 Algérie', played: 0, w: 0, d: 0, l: 0, pts: 0 },
                {
                  pos: 2,
                  team: 'Burkina Faso',
                  played: 0,
                  w: 0,
                  d: 0,
                  l: 0,
                  pts: 0,
                },
                {
                  pos: 3,
                  team: 'Mauritanie',
                  played: 0,
                  w: 0,
                  d: 0,
                  l: 0,
                  pts: 0,
                },
                {
                  pos: 4,
                  team: 'Guinée Équatoriale',
                  played: 0,
                  w: 0,
                  d: 0,
                  l: 0,
                  pts: 0,
                },
              ].map((team) => (
                <tr
                  key={team.pos}
                  className={
                    team.team.includes('Algérie') ? 'bg-primary/5' : ''
                  }
                >
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {team.pos}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {team.team}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                    {team.played}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                    {team.w}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                    {team.d}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                    {team.l}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-900 dark:text-white">
                    {team.pts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
