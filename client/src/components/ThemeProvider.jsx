import PropTypes from 'prop-types';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  // const { theme } = useSelector((state) => state.theme);
  const themeState = useSelector((state) => state.theme);
  
  // Memoize the theme variable
  const theme = useMemo(() => themeState.theme, [themeState]);
  
  return (
    <div className={theme}>
      <div
        className="bg-white text-gray-700 dark:text-gray-200 
        dark:bg-[rgb(16,23,42)] min-h-screen"
      >
        {children}
      </div>
    </div>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
