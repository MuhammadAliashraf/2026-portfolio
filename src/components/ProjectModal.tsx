import React, { useEffect, useState } from "react";
import { FaGithub, FaYoutube } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import "./styles/ProjectModal.css";

interface Project {
  id: number;
  title: string;
  category: string;
  technologies: string | string[];
  image: string;
  description: string;
  githubLink?: string;
  liveLink?: string;
  youtubeLink?: string;
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  startWithVideo?: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, startWithVideo = false }) => {
  const [showVideoLightbox, setShowVideoLightbox] = useState(startWithVideo);

  // Prevent page scroll when modal is open and restore original style on close
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalOverflowY = document.body.style.overflowY;

    document.body.style.overflow = "hidden";
    document.body.style.overflowY = "hidden";

    // Close on Escape key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showVideoLightbox) {
          setShowVideoLightbox(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overflowY = originalOverflowY;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, showVideoLightbox]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(project.youtubeLink);

  const techTags = typeof project.technologies === "string"
    ? project.technologies.split(",").map((tech) => tech.trim())
    : project.technologies;

  return (
    <>
      <div className="project-modal-overlay" onClick={handleBackdropClick}>
        <div className="project-modal-container">
          <button className="project-modal-close" onClick={onClose} aria-label="Close modal">
            <MdClose />
          </button>

          <div className="project-modal-image-wrapper">
            <img src={project.image} alt={project.title} className="project-modal-image" />
          </div>

          <div className="project-modal-content">
            <div className="project-modal-header">
              <span className="project-modal-category">{project.category}</span>
              <h2 className="project-modal-title">{project.title}</h2>
            </div>

            <div className="project-modal-body">
              <h3>About the Project</h3>
              <p className="project-modal-description">{project.description}</p>
            </div>

            {/* Inline Video Demonstration Section */}
            {embedUrl && (
              <div className="project-modal-video-section">
                <h3>Video Demonstration</h3>
                <div className="project-modal-video-wrapper">
                  <iframe
                    width="100%"
                    src={embedUrl}
                    title={`${project.title} Video Demo`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div className="project-modal-tech-section">
              <h3>Technologies Used</h3>
              <div className="project-modal-tags">
                {techTags.map((tech, index) => (
                  <span key={index} className="project-modal-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="project-modal-footer">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link github-btn"
                >
                  <FaGithub /> GitHub Repository
                </a>
              )}
              {project.youtubeLink && (
                embedUrl ? (
                  <button
                    onClick={() => setShowVideoLightbox(true)}
                    className="project-modal-link youtube-btn"
                    style={{ border: "none" }}
                  >
                    <FaYoutube /> Watch Video (Popup)
                  </button>
                ) : (
                  <a
                    href={project.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-modal-link youtube-btn"
                  >
                    <FaYoutube /> Watch Video
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic overlay Lightbox Modal */}
      {showVideoLightbox && embedUrl && (
        <div className="video-lightbox-overlay" onClick={() => setShowVideoLightbox(false)}>
          <div className="video-lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-lightbox-close"
              onClick={() => setShowVideoLightbox(false)}
              aria-label="Close video player"
            >
              <MdClose />
            </button>
            <div className="video-lightbox-wrapper">
              <iframe
                src={`${embedUrl}?autoplay=1`}
                title={`${project.title} Video Demo`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectModal;
