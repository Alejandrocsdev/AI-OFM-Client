// Module CSS
import S from './style.module.css';

const Header = () => {
  return (
    <header className={S.header}>
      <div className={S.left}>
        <div className={S.logo}>
          <span className={S.logoAi}>AI</span>
          <div className={S.logoDivider} />
          <span className={S.logoOfm}>OFM</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
