import Footer from "./Footer";
import useThemeSwitcher from "./useThemeSwitcher";

const Layout = ({ children }) => {
  const ThemeSwitcher = useThemeSwitcher();
  return (
    <div>
      <div className="content">{children}</div>
      <Footer />
      {ThemeSwitcher}
    </div>
  );
};

export default Layout;
