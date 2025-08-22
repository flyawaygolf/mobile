import { Platform } from "react-native";

export type Ithemes = 'auto' | 'white' | 'dark';

export interface colorsInterface {
    bg_primary: string,
    bg_primary_opacity: string,
    bg_secondary: string,
    bg_third: string,
    bg_secondary_rgba: string,
    text_normal: string,
    text_normal_hover: string,
    text_link: string,
    text_muted: string,
    badge_color: string,
    fa_primary: string,
    fa_secondary: string,
    fa_third: string,
    warning_color: string,
    good_color: string,
    medium_color: string,
    off_color: string,
    color_white: string,
    color_blue: string,
    color_blue_hover: string,
    color_red: string,
    color_green: string,
    color_yellow: string,
    color_black: string,
    color_brass: string,
    color_bronze: string,
    color_copper: string,
    color_gold: string,
    color_silver: string,
    color_platinum: string,
    color_brown: string,
    color_grey: string,
    color_jade: string,
    color_teal: string,
    color_turquoise: string,
    color_burgundy: string,
    color_magenta: string,
    color_orange: string,
    color_peach: string,
    color_purple: string,
    color_male: string,
    color_female: string,
    hover_overlay: string,
};

export const WhiteTheme: { colors: colorsInterface } = {
    colors: {
        // Background colors
        bg_primary: "#F5F5F5",
        bg_primary_opacity: "#D9D9D9",
        bg_secondary: Platform.OS === "android" ? "#EAEAEA" : "#EAEAEA",
        bg_third: "#989898",
        bg_secondary_rgba: "rgba(234, 234, 234, 1)",
        
        // Text colors
        text_normal: "#181818",
        text_normal_hover: "#858585",
        text_link: "#00b0f4",
        text_muted: "#8C8F93",
        
        // App specific colors
        badge_color: "#f04747",
        fa_primary: "#3B3B98",
        fa_secondary: "#32328F",
        fa_third: "#252582",
        
        // Status colors
        warning_color: "#ea4646",
        good_color: "#43b581",
        medium_color: "#faa61a",
        off_color: "#6e7985",
        
        // Basic colors
        color_white: "#FFFFFF",
        color_blue: "#1c9eff",
        color_blue_hover: "#007ad6",
        color_red: "#cc3300",
        color_green: "#339900",
        color_yellow: "#ffcc00",
        color_black: "#000000",
        
        // Material colors
        color_brass: "#B5651D",
        color_bronze: "#CD7F32",
        color_copper: "#B87333",
        color_gold: "#FFD700",
        color_silver: "#C0C0C0",
        color_platinum: "#E5E4E2",
        
        // Natural colors
        color_brown: "#8B4513",
        color_grey: "#808080",
        color_jade: "#00A86B",
        color_teal: "#008080",
        color_turquoise: "#40E0D0",
        
        // Vibrant colors
        color_burgundy: "#800020",
        color_magenta: "#FF00FF",
        color_orange: "#FFA500",
        color_peach: "#FFCBA4",
        color_purple: "#800080",
        
        // Gender colors
        color_male: "#4D9EE0",
        color_female: "#E72983",
        
        // Interaction
        hover_overlay: "rgba(255, 255, 255, 0.1)",
    },
};

export const DarkTheme: { colors: colorsInterface } = {
    colors: {
        bg_primary: "#171717",
        bg_primary_opacity: "#141414",
        bg_secondary: "#272727",
        bg_third: "#0E0E0E",
        text_normal: "#f9f9f9",
        text_normal_hover: "#B7B7B7",
        text_link: "#00b0f4",
        text_muted: "#A9A9A9",
        badge_color: "#f04747",
        fa_primary: "#5faa71",
        fa_secondary: "#519161",
        fa_third: "#437851",
        warning_color: "#ea4646",
        good_color: "#43b581",
        medium_color: "#faa61a",
        off_color: "#6e7985",

        // Basic colors
        color_white: "#FFFFFF",
        color_blue: "#1c9eff",
        color_blue_hover: "#007ad6",
        color_red: "#cc3300",
        color_green: "#339900",
        color_yellow: "#ffcc00",
        color_black: "#000000",
        
        // Material colors
        color_brass: "#B5651D",
        color_bronze: "#CD7F32",
        color_copper: "#B87333",
        color_gold: "#FFD700",
        color_silver: "#C0C0C0",
        color_platinum: "#E5E4E2",
        
        // Natural colors
        color_brown: "#8B4513",
        color_grey: "#808080",
        color_jade: "#00A86B",
        color_teal: "#008080",
        color_turquoise: "#40E0D0",
        
        // Vibrant colors
        color_burgundy: "#800020",
        color_magenta: "#FF00FF",
        color_orange: "#FFA500",
        color_peach: "#FFCBA4",
        color_purple: "#800080",
        
        // Gender colors
        color_male: "#4D9EE0",
        color_female: "#E72983",
        
        hover_overlay: "rgba(255, 255, 255, 0.1)",
        bg_secondary_rgba: "rgba(20, 20, 24, 1)",
    },
};

