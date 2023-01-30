import ContentHeader from "components/ContentHeader";
import { useMemo } from "react";
import paths from "routes/paths";
import AboutSection from "./components/AboutSection";

const About: React.FC = () => {
  const renderSubtitle = useMemo(() => {
    return (
      <div>
        Here you can find information about the project, its purpose and the technologies used. Along with . . .
      </div>
    )
  }, []);

  return (
    <div>
      <ContentHeader
        title={paths.about.title}
        subtitle={renderSubtitle}
      />
      <div>
        <AboutSection 
        title="Who is the author of this project?"
        content="This is a final project for Software Engineering in ITBA. It was started by Jimena Lozano and Maite Herrán, and now it is continued by Nicolás Britos and Agustín Roca. From the beginning this project was tutored by Rodrigo Ramele."
        />
        <AboutSection
        title="What is the purpose of this project?"
        content="El Laboratorio de Sueño y Memoria from Instituto Tecnológico de Buenos Aires (ITBA) studies the formation of false memories, and how these can be reduced or modified, and is in collaboration with the Innocence Project to investigate how these can lead to errors in convictions. From this research, the need arises to carry out experiments with human faces that are similar to each other, and how this similarity can result in the formation of false memories.

        In this project, we investigate a field of Artificial Intelligence (AI), Deep Learning, which can provide us with a solution to the generation of artificial faces. In particular, we implement a face generation model using a Generative Adversarial Network (GAN), with the aim of generating faces as realistic as possible, so that a human cannot distinguish them from real faces. StyleGAN, a particular implementation of the GAN network, was the chosen architecture, because in addition to producing images with high resolution quality, it presents a model that allows navigation of the latent space and the synthesis of faces, using style mixing properties."
        />
        </div>
    </div>
  );
}

export default About;