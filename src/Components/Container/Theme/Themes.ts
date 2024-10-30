import { Platform } from "react-native";

export type Ithemes = 'auto' | 'white' | 'dark';

export const WhiteTheme = {
    colors: {
        bg_primary: "#fafafa",
        bg_primary_opacity: "#D9D9D9",
        bg_secondary: Platform.OS === "android" ? "#EAEAEA" : "#C8CACA",
        bg_third: "#989898",
        text_normal: "#181818",
        text_normal_hover: "#858585",
        text_link: "#00b0f4",
        text_muted: "#8C8F93",
        badge_color: "#f04747",
        fa_primary: "#3B3B98",
        fa_secondary: "#D64800",
        fa_third: "#AD2200",
        warning_color: "#ea4646",
        good_color: "#43b581",
        medium_color: "#faa61a",
        off_color: "#6e7985",
        color_blue: "#1c9eff",
        color_blue_hover: "#007ad6",
        color_red: "#cc3300",
        color_green: "#339900",
        color_yellow: "#ffcc00",
        color_male: "#4D9EE0",
        color_female: "#E72983",
        hover_overlay: "rgba(255, 255, 255, 0.1)",
        bg_secondary_rgba: "rgba(234, 234, 234, 1)"
    },
};

export const DarkTheme = {
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
        color_blue: "#1c9eff",
        color_blue_hover: "#007ad6",
        color_red: "#cc3300",
        color_green: "#339900",
        color_yellow: "#ffcc00",
        color_male: "#4D9EE0",
        color_female: "#E72983",
        hover_overlay: "rgba(255, 255, 255, 0.1)",
        bg_secondary_rgba: "rgba(20, 20, 24, 1)"
    }
};

