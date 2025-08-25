import React, { PropsWithChildren } from 'react';

import ThemeProvider from './Theme/ThemeProvider';

type SectionProps = PropsWithChildren

function ThemeContainer({ children }: SectionProps) {

    return (
        <ThemeProvider>
            { children }
        </ThemeProvider>
    );
}

export default ThemeContainer;
