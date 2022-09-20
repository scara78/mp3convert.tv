import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar" data-nosnippet>
      <h1>mp3convert.tv</h1>
      <div className="links">
        <Link href="/">Download</Link>
        <Link href="/history">History</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
