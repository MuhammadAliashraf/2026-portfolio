import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaYoutube } from "react-icons/fa6";
import { config } from "../config";
import ProjectModal from "../components/ProjectModal";
import "./MyWorks.css";

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

const MyWorks = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [startWithVideo, setStartWithVideo] = useState(false);

  useEffect(() => {
    // Enable body scrolling when MyWorks page is loaded
    document.body.style.overflow = "auto";
    document.body.style.overflowY = "auto";

    return () => {
      // Re-disable body scrolling when leaving the page to preserve homepage animations
      document.body.style.overflow = "hidden";
      document.body.style.overflowY = "hidden";
    };
  }, []);

  return (
    <div className="myworks-page">
      <div className="myworks-header">
        <Link to="/" className="back-button" data-cursor="disable">
          ← Back to Home
        </Link>
        <h1>
          All <span>Works</span>
        </h1>
        <p>A collection of all my projects and creations</p>
      </div>

      <div className="myworks-grid">
        {config.projects.map((project, index) => (
          <div
            className="myworks-card"
            key={project.id}
            data-cursor="disable"
            onClick={() => {
              setSelectedProject(project);
              setStartWithVideo(false);
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="myworks-card-number">0{index + 1}</div>
            <div className="myworks-card-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="myworks-card-info">
              <h3>{project.title}</h3>
              <p className="myworks-card-category">{project.category}</p>
              <p className="myworks-card-description">{project.description}</p>
              <p className="myworks-card-tech">{project.technologies}</p>
              <div className="myworks-card-links" onClick={(e) => e.stopPropagation()}>
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link github-link"
                    title="View GitHub Repository"
                  >
                    <FaGithub /> GitHub
                  </a>
                )}
                {project.youtubeLink && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setStartWithVideo(true);
                    }}
                    className="project-link youtube-link"
                    title="Watch YouTube Video"
                    style={{ border: "none" }}
                  >
                    <FaYoutube /> Watch Video
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          startWithVideo={startWithVideo}
          onClose={() => {
            setSelectedProject(null);
            setStartWithVideo(false);
          }}
        />
      )}
    </div>
  );
};

export default MyWorks;
