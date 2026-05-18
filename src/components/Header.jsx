import trollFace from "../assets/meme.png";

export default function Header() {
  return (
    <div className="headerDiv" style={{display : "flex", alignContent:"center", justifyContent:"space-between"}}>
      <header className="header">
        <img src={trollFace} />
        <h1>Meme Generator</h1>
      </header>
      <h3>MADE BY RAIYAN</h3>
    </div>
  );
}
