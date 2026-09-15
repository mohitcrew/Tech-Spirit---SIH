import React, { useState } from 'react';
import { Users, Star, Award, BookOpen, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import { publicTrainers, PublicTrainer } from '../../data/skillsyncData';

interface TrainerExplorerProps {
  onConnectTrainer: (trainer: PublicTrainer) => void;
}

export const TrainerExplorer: React.FC<TrainerExplorerProps> = ({ onConnectTrainer }) => {
  const [selectedExpertise, setSelectedExpertise] = useState('All');

  const filteredTrainers = selectedExpertise === 'All'
    ? publicTrainers
    : publicTrainers.filter(t => t.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase())));

  return (
    <section id="trainers" className="py-20 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Faculty & Mentorship Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
              Find Experts Based on Competency Needs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Connect with vetted industry educators, technical architects, and cohort coaches.
            </p>
          </div>
        </div>

        {/* Trainer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map(trainer => (
            <div
              key={trainer.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-md"
            >
              <div>
                {/* Header: Avatar, Name, Rating */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {trainer.name}
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium leading-tight mt-0.5">
                      {trainer.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {trainer.organization} · {trainer.experienceYears}y exp
                    </p>
                  </div>
                </div>

                {/* Rating & Availability Pill */}
                <div className="flex items-center justify-between mb-4 text-xs">
                  <span className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{trainer.rating} rating</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {trainer.availability}
                  </span>
                </div>

                {/* Expertise Badges */}
                <div className="mb-4">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1.5">Core Expertise</div>
                  <div className="flex flex-wrap gap-1">
                    {trainer.expertise.map(exp => (
                      <span key={exp} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-center text-xs mb-4 border border-slate-200 dark:border-transparent">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase">Students</span>
                    <span className="font-bold text-slate-900 dark:text-white">{trainer.studentsTrained}+</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase">Courses</span>
                    <span className="font-bold text-slate-900 dark:text-white">{trainer.coursesCount} Programs</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => alert(`Reviewing full profile and past publications of ${trainer.name}`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center border border-slate-200 dark:border-transparent"
                >
                  Full Bio
                </button>
                <button
                  onClick={() => onConnectTrainer(trainer)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all text-center shadow-md shadow-blue-600/30 flex items-center justify-center gap-1"
                >
                  <span className="text-white">Connect</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
