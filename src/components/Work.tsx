import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";
import { FaGithub, FaYoutube } from "react-icons/fa6";
import ProjectModal from "./ProjectModal";

gsap.registerPlugin(ScrollTrigger);

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

const Work = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [startWithVideo, setStartWithVideo] = useState(false);

  useEffect(() => {
    // Disable pinning on mobile to allow scrolling
    if (window.innerWidth <= 768) return;

    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    // Refresh ScrollTrigger after layout settles
    ScrollTrigger.refresh();

    // Clean up
    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {config.projects.slice(0, 5).map((project, index) => (
            <div
              className="work-box"
              key={project.id}
              onClick={() => {
                setSelectedProject(project);
                setStartWithVideo(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
                <div className="work-links" onClick={(e) => e.stopPropagation()}>
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link github-link"
                      data-cursor="disable"
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
                      data-cursor="disable"
                      style={{ border: "none" }}
                    >
                      <FaYoutube /> Watch Video
                    </button>
                  )}
                </div>
              </div>
              <WorkImage image={project.image} alt={project.title} />
            </div>
          ))}
          {/* See All Works Button */}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                See All Works →
              </Link>
            </div>
          </div>
        </div>
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

export default Work;
