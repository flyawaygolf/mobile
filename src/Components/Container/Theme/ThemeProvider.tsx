import * as React from 'react';
import { useColorScheme } from 'react-native';

import ThemeContext from './ThemeContext';
import { WhiteTheme, DarkTheme, Ithemes } from './Themes';

type Props = {
    children: React.ReactNode
}

const ThemeProvider: React.FC<Props> = ({ children }) => {

    const scheme = useColorScheme();
    const [theme, setTheme] = React.useState({
        type: 'white',
        ...WhiteTheme,
    });

    const changeTheme = (type: Ithemes) => {

        let style = WhiteTheme;
        let new_type = type;
        switch (type) {
            case 'auto':
                style = scheme === 'dark' ? DarkTheme : WhiteTheme;
                new_type = scheme === 'dark' ? "dark" : "white";
                break;
            case 'white':
                style = WhiteTheme;
                break;
            case 'dark':
                style = DarkTheme;
                break;
            default:
                break;
        }

        setTheme({
            type: new_type,
            ...style,
        });
    };

    React.useEffect(() => {
        changeTheme('auto');
    }, [scheme]);

    return (
        <ThemeContext.Provider value={{ setTheme: changeTheme, colors: theme.colors, theme: theme.type }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
