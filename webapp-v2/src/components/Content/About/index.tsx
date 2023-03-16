import ContentHeader from 'components/ContentHeader';
import { useCallback, useMemo } from 'react';
import paths from 'routes/paths';
import aboutJson from 'assets/data/about.json';
import AboutSection from './components/AboutSection';

const About: React.FC = () => {
  const renderSubtitle = useMemo(
    () => <div>{aboutJson.subtitle}</div>,
    [aboutJson]
  );

  const AboutAuthors: React.FC = useCallback(
    () => (
      <AboutSection
        title={aboutJson.about_authors.title}
        content={aboutJson.about_authors.content}
      />
    ),
    []
  );

  const AboutProject: React.FC = useCallback(
    () => (
      <AboutSection
        title={aboutJson.about_project.title}
        content={aboutJson.about_project.content}
      />
    ),
    []
  );

  return (
    <div>
      <ContentHeader title={paths.about.title} subtitle={renderSubtitle} />
      <div>
        <AboutAuthors />
        <AboutProject />
      </div>
    </div>
  );
};

export default About;
