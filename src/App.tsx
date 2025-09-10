import { Suspense } from 'react';
import Layout from './components/common/Layout';
import BackToTop from './components/common/BackToTop';
import ScrollReveal from './components/common/ScrollReveal';
import SuspenseFallback from './components/common/SuspenseFallback';
import LazyComponent from './components/common/LazyComponent';
import SkipLinks from './components/common/SkipLinks';
import Hero from './components/sections/Hero';
import { LazyProjects, LazySkills, LazyResume, LazyContact } from './components/lazy';
import { useScrollNavigation } from './hooks/useScrollNavigation';
import { useRouteAnnouncement } from './hooks/useFocusManagement';

// Development accessibility tools
if (process.env.NODE_ENV === 'development') {
  import('./utils/devAccessibility');
}

function App() {
  const sectionIds = ['hero', 'about', 'projects', 'skills', 'resume', 'contact'];
  const { showBackToTop } = useScrollNavigation(sectionIds);
  const { announceRouteChange } = useRouteAnnouncement();

  return (
    <>
      <SkipLinks />
      <Layout>
          <Hero />

          {/* Placeholder sections for future implementation */}
          <ScrollReveal animation="slideUp" delay={0.1}>
            <section id="about" className="section" aria-labelledby="about-heading">
              <div className="container">
                <h2 id="about-heading">About</h2>
                <p>About section coming soon...</p>
              </div>
            </section>
          </ScrollReveal>

          <LazyComponent>
            <ScrollReveal animation="slideUp" delay={0.2}>
              <Suspense fallback={<SuspenseFallback height="400px" message="Loading projects..." />}>
                <section id="projects" aria-labelledby="projects-heading">
                  <LazyProjects />
                </section>
              </Suspense>
            </ScrollReveal>
          </LazyComponent>

          <LazyComponent>
            <ScrollReveal animation="slideUp" delay={0.1}>
              <Suspense fallback={<SuspenseFallback height="300px" message="Loading skills..." />}>
                <section id="skills" aria-labelledby="skills-heading">
                  <LazySkills />
                </section>
              </Suspense>
            </ScrollReveal>
          </LazyComponent>

          <LazyComponent>
            <ScrollReveal animation="slideUp" delay={0.2}>
              <Suspense fallback={<SuspenseFallback height="500px" message="Loading resume..." />}>
                <section id="resume" aria-labelledby="resume-heading">
                  <LazyResume />
                </section>
              </Suspense>
            </ScrollReveal>
          </LazyComponent>

          <LazyComponent>
            <ScrollReveal animation="slideUp" delay={0.1}>
              <Suspense fallback={<SuspenseFallback height="400px" message="Loading contact form..." />}>
                <section id="contact" aria-labelledby="contact-heading">
                  <LazyContact />
                </section>
              </Suspense>
            </ScrollReveal>
          </LazyComponent>
        <BackToTop show={showBackToTop} />
      </Layout>
    </>
  );
}

export default App;
