type AppFooterProps = {
  updatedAt: string;
};

export function AppFooter({ updatedAt }: AppFooterProps) {
  return (
    <footer className="footer">
      <span>Zuletzt aktualisiert: {updatedAt}</span>
      <a
        className="github-link"
        href="https://github.com/injeqt"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub Profil öffnen"
        title="GitHub"
      >
        <img
          className="github-icon"
          src="/GitHub_Invertocat_Black.svg"
          alt=""
          aria-hidden="true"
        />
      </a>
    </footer>
  );
}
