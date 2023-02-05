import ContentHeader from "components/ContentHeader";
import { useMemo } from "react";
import paths from "routes/paths";
import AboutSection from "./components/AboutSection";
import aboutJson from "assets/about.json";
const About: React.FC = () => {
  const renderSubtitle = useMemo(() => {
    return (
      <div>
        Here you can find information about the project, its purpose and the technologies used. Along with . . .
      </div>
    )
  }, []);

  const aboutAuthors = useMemo(() => ({
    title: aboutJson['about_authors'].title,
    content: aboutJson['about_authors'].content
  }), []);

  const aboutPurpose = useMemo(() => ({
    title: aboutJson['about_project'].title,
    content: aboutJson['about_project'].content
  }), []);

  return (
    <div>
      <ContentHeader
        title={paths.about.title}
        subtitle={renderSubtitle}
      />
      <div>
        <AboutSection 
        title={aboutAuthors.title}
        content={aboutAuthors.content}
        />
        <AboutSection
        title={aboutPurpose.title}
        content={aboutPurpose.content}
        />
        </div>
    </div>
  );
}

export default About;