import ContentHeader from "components/ContentHeader"
import { useCallback, useMemo } from "react"
import paths from "routes/paths"
import AboutSection from "./components/AboutSection"
import aboutJson from "assets/data/about.json"
const About: React.FC = () => {
  const renderSubtitle = useMemo(() => {
    return (
      <div>
        Here you can find information about the project, its purpose and the
        technologies used. Along with . . .
      </div>
    )
  }, [])

  const AboutAuthors: React.FC = useCallback(
    () => (
      <AboutSection
        title={aboutJson["about_authors"].title}
        content={aboutJson["about_authors"].content}
      />
    ),
    []
  )

  const AboutProject: React.FC = useCallback(
    () => (
      <AboutSection
        title={aboutJson["about_project"].title}
        content={aboutJson["about_project"].content}
      />
    ),
    []
  )

  return (
    <div>
      <ContentHeader title={paths.about.title} subtitle={renderSubtitle} />
      <div>
        <AboutAuthors />
        <AboutProject />
      </div>
    </div>
  )
}

export default About
