import Link from "next/link";

const Footer = () => {
  return (
    <footer className="content" data-nosnippet>
      <p>Copyright &copy; 2020 - 2022</p>
      <div className="footer-links">
        <Link href="/termsOfUse">Terms Of Use</Link>
        <Link href="/privacyPolicy">Privacy Policy</Link>
        <Link href="/patchNotes">Patch Notes</Link>
      </div>
    </footer>
  );
};

export default Footer;
