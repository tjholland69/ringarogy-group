const projects = [
  { name: "Parlay Conch", href: "https://parlayconch.com" },
  { name: "Parallel Cals", href: "https://parallel-cals.com" },
  { name: "Enume Tracker", href: "https://enume-tracker.com" },
  { name: "NDAZ", href: "https://ndaz.app" },
];

export default function Home() {
  return (
    <div className="shell">
      <header className="nav">
        <a className="brand" href="#top" aria-label="Ringarogy Group home">
          <span className="mark" aria-hidden="true" />
          <span>Ringarogy Group</span>
        </a>
        <p className="navNote">Independent LLC </p>
      </header>

      <main id="top" className="main">
        <section className="hero" aria-labelledby="headline">
          <p className="eyebrow">A wide field of view</p>
          <h1 id="headline">
            Masters of none.<br />
            <em>Interested</em> in everything.
          </h1>
          <p className="thesis">
            Built with a long horizon: thoughtful owners of <strong>intellectual property and human capital.</strong>
          </p>
        </section>

        <aside className="side" aria-labelledby="projects-title">
          <p id="projects-title" className="sideLabel">Works in progress <span>·</span> 01—04</p>
          <ul className="projects">
            {projects.map((project) => (
              <li key={project.href}>
                <a href={project.href} target="_blank" rel="noreferrer">
                  <span>{project.name}</span>
                  <span className="arrow" aria-hidden="true">↗</span>
                  <span className="srOnly"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </main>

      <footer className="footer">
        <p className="origin"><strong>Inspired by Ringarogy Island</strong> — a small seaside community.</p>
        <div className="horizon" aria-label="Our outlook">
          <span></span>
          <span></span>
        </div>
      </footer>
    </div>
  );
}
