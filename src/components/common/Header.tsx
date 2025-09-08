import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Header.module.scss';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Search', path: '/search' },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          React Blog
        </Link>

        <nav
          className={clsx(styles.nav, { [styles.open as string]: menuOpen })}
          aria-label="Primary navigation"
        >
          <ul>
            {navItems.map(({ name, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    clsx(styles.navLink, { [styles.active as string]: isActive })
                  }
                  onClick={closeMenu}
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.controls}>
          <ThemeToggle />
          
          <button
            className={styles.menuToggle}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            type="button"
          >
            <span className={styles.hamburger} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
