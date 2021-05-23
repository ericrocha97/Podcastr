import Link from 'next/link';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext'
import styles from './styles.module.scss';


export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', { locale: ptBR })

  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <img src={darkMode ? '/logo-white.svg' : '/logo.svg'} className={styles.logo} alt="Podcastr" />
      </Link>
      <p>O melhor para você ouvir, sempre</p>

      <span>
        <div className={(styles.toogleTheme) + ' ' + (darkMode ? styles.darkTheme : '')} onClick={toggleDarkMode}>
          <span></span>
        </div>

        <div className={styles.currentDate}>
          {currentDate}
        </div>
      </span>
    </header>
  );
}