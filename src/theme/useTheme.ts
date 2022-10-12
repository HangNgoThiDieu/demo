import { useEffect, useState } from "react";
import { COLORS, COLORS_DEFAULT } from "utils/constants";
import { tokenHelper } from "utils/store-token";


export const useTheme = (props?: any) => {
    const themes = tokenHelper.getColorsFromStorage(COLORS_DEFAULT);
    const [theme, setTheme] = useState(themes.default);
    const [themeLoaded, setThemeLoaded] = useState(false);

    const setMode = (mode: any) => {
        tokenHelper.setColorsToStorage(COLORS, mode)
        setTheme(mode);
    };

    useEffect(() => {
        const localTheme = tokenHelper.getColorsFromStorage(COLORS);
        localTheme ? setTheme(localTheme) : setTheme(themes.default);
        setThemeLoaded(true);
    }, []);

    return { theme, themeLoaded, setMode };
}