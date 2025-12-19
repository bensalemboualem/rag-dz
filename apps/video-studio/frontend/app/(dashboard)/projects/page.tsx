"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Download, Trash2, MoreVertical, Calendar, Clock } from "lucide-react";

interface Project {
  id: string;
  name: string;
  thumbnail: string;
  status: "completed" | "processing" | "failed";
  createdAt: string;
  duration: string;
  type: "text-to-video" | "image-to-video";
}

const projects: Project[] = [
  {
    id: "1",
    name: "Promo Ramadan 2025",
    thumbnail: "/projects/ramadan.jpg",
    status: "completed",
    createdAt: "2024-12-19",
    duration: "15s",
    type: "text-to-video",
  },
  {
    id: "2",
    name: "Story Instagram - Nouveau produit",
    thumbnail: "/projects/story.jpg",
    status: "completed",
    createdAt: "2024-12-18",
    duration: "10s",
    type: "image-to-video",
  },
  {
    id: "3",
    name: "Intro chaîne YouTube",
    thumbnail: "/projects/intro.jpg",
    status: "processing",
    createdAt: "2024-12-19",
    duration: "5s",
    type: "text-to-video",
  },
];

export default function ProjectsPage() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-success/20 text-success rounded-full">
            Terminé
          </span>
        );
      case "processing":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-warning/20 text-warning rounded-full animate-pulse">
            En cours...
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-error/20 text-error rounded-full">
            Échoué
          </span>
        );
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold mb-2">Mes Projets</h1>
            <p className="text-text-muted">
              Retrouvez toutes vos vidéos générées
            </p>
          </div>
          {selectedProjects.length > 0 && (
            <button className="flex items-center gap-2 px-4 py-2 bg-error hover:bg-error/80 rounded-lg font-medium">
              <Trash2 className="w-4 h-4" />
              Supprimer ({selectedProjects.length})
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-surface mx-auto mb-6 flex items-center justify-center">
              <Play className="w-10 h-10 text-text-muted" />
            </div>
            <h2 className="font-heading text-xl font-semibold mb-2">Aucun projet</h2>
            <p className="text-text-muted mb-6">
              Créez votre première vidéo dans le Studio
            </p>
            <a
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover rounded-xl font-medium"
            >
              Aller au Studio
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group bg-surface border rounded-2xl overflow-hidden transition-colors ${
                  selectedProjects.includes(project.id)
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-background">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  
                  {/* Select checkbox */}
                  <button
                    onClick={() => toggleSelect(project.id)}
                    className={`absolute top-3 left-3 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedProjects.includes(project.id)
                        ? "bg-primary border-primary"
                        : "border-white/50 hover:border-white"
                    }`}
                  >
                    {selectedProjects.includes(project.id) && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Status */}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(project.status)}
                  </div>

                  {/* Play button */}
                  {project.status === "completed" && (
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </button>
                  )}

                  {/* Duration */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-background/60 backdrop-blur rounded-full">
                    <Clock className="w-3 h-3 text-text-muted" />
                    <span className="text-xs text-text-muted">{project.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading font-semibold truncate">{project.name}</h3>
                    <button className="p-1 hover:bg-surface-hover rounded">
                      <MoreVertical className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-text-muted">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                    
                    {project.status === "completed" && (
                      <button className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium">
                        <Download className="w-4 h-4" />
                        Télécharger
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
