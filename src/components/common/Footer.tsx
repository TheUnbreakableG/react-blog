import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <p>© {new Date().getFullYear()} React Blog. All rights reserved.</p>
      <nav aria-label="Footer navigation">
        <ul className={styles.footerNav}>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
);

export default Footer;
