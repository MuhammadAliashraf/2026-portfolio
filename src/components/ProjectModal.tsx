import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa6";
import { MdArrowOutward, MdClose } from "react-icons/md";
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
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Prevent page scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Close on Escape key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const techTags = typeof project.technologies === "string"
    ? project.technologies.split(",").map((tech) => tech.trim())
    : project.technologies;

  return (
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
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-link live-btn"
              >
                Live Demo <MdArrowOutward />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
