import trollFace from "../assets/meme.png";

export default function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#" aria-label="Meme Studio home">
        <span className="brand-mark"><img src={trollFace} alt="" /></span>
        <span className="brand-name">Meme<span>Studio</span></span>
      </a>
      <span className="header-note"><span className="header-dot" /> YOUR DAILY DOSE OF INTERNET
      </span>
      <span className="header-credit">MADE FOR THE GROUP CHAT <span>↗</span></span>
    </header>
  );
}
