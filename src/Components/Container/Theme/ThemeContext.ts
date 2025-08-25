import * as React from 'react';

import { WhiteTheme, Ithemes } from './Themes';


const ThemeContext = React.createContext({
    theme: 'dark',
    setTheme: (_type: Ithemes) => {},
    ...WhiteTheme,
});

ThemeContext.displayName = 'ThemeContext';

export default ThemeContext;
