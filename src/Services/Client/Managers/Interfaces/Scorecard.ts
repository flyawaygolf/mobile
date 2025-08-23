import { CompetitionFormatEnum } from "./Events";
import { requestResponseInterface, successResponse, userInfo } from "./Global";

export interface TeeboxesColor {
    id: number;
    name: string;
    hexadecimalRgbCode: string;
}

export enum GameModeEnum {
    PUBLIC = 1,
    PRIVATE = 2,
    TOURNAMENT = 3
}

export enum ScoreCardStatus {
    DRAFT = 0,
    COMPLETED = 1
}

export interface HoleScorecardSchemaInterface {
    hole_number: number;
    score?: number;
    putts?: number;
    /**
     * 0 : miss left
     * 1 : hit
     * 2 : miss right
     */
    fairway?: number;
    /**
     * 0 : miss left
     * 1 : hit
     * 2 : miss right
     * 3 : short
     * 4 : long
     */
    green?: number;
    puts?: number;
    chips?: number;
    penalty?: number;
    sand?: boolean;
    notes?: string;
    /** Score total renseigné si la carte n'est pas complète */
    score_total?: number;
}

export interface formatTeeboxInterface {
    teebox_id: string;
    name?: string;
    slope?: number;
    rating?: number;
    distances: number[];
    color?: TeeboxesColor;
}

export interface formatPlayersScoreCardReturnInterface {
    user_info: {
        user_id: string;
        username: string;
        nickname: string;
        avatar: string;
        banner?: string;
        current_hcp: number;
        playing_hcp: number;
    };
    scorecard_info: {
        user_scorecard_id: string;
        holes: HoleScorecardSchemaInterface[];
        teebox_info?: formatTeeboxInterface;
    }
}

export interface getUserScoreCardInterface {
    user_scorecard_id: string;
    teebox_id: string;
    user_id: string;
    scorecard_grid_id: string;
    scorecard_id: string;
    golf_id: string;
    format: number;
    game_mode: number;
    starting_hole: number;
    playing_date: Date;
    event_id?: string;
    name: string;
    players: formatPlayersScoreCardReturnInterface[];
    total_score?: number;
    status: number;
    holes: HoleScorecardSchemaInterface[];
    created_at: Date;
    updated_at: Date;
    golf_info: {
        golf_id: string;
        name: string;
    } | null,
    grid_info: {
        grid_id: string;
        par: number[];
        handicap: number[];
    } | null;
    teebox_info?: formatTeeboxInterface | null,
    user_info: userInfo | null;
}

export type userScoreCardResponse = requestResponseInterface<getUserScoreCardInterface>;

export type multipleUserScoreCardsResponse = requestResponseInterface<getUserScoreCardInterface[]>;

export interface scorecardCreatorParams {

    /** Identifiant du teebox utilisé */
    teebox_id: string,

    /** (Optionnel) Lien avec un event/compétition */
    event_id?: string;

    /** Nom personnalisé de la carte de score */
    name?: string;

    /** Format du jeu (Stroke play, Match play, etc.) */
    format?: CompetitionFormatEnum;

    /** Mode de jeu (Public, Privé, Tournoi, etc.) */
    game_mode?: GameModeEnum;

    /** Trou de départ (par ex. 1 ou 10) */
    starting_hole?: number;

    /** Date de la partie */
    playing_date?: Date;

    /** Statut de la carte (Draft ou Completed) */
    status?: ScoreCardStatus;

    /** Joueurs associés à la partie */
    players?: {
        user_id: string;
        handicap: number;
    }[];

    /** Score total (optionnel, peut aussi être calculé après trous) */
    total_score?: number;

    /** Résultats trou par trou */
    holes?: HoleScorecardSchemaInterface[];
}

export type scorecardCreatorResponse = requestResponseInterface<{
    user_scorecard_id: string;
}>

export interface scorecardUpdateParams {
    /** Nom de la carte de score */
    name?: string;

    /** Format du jeu (Stroke play, Match play, etc.) */
    format?: CompetitionFormatEnum;

    /** Mode de jeu (Public, Privé, Tournoi, etc.) */
    game_mode?: GameModeEnum;

    /** Trou de départ */
    starting_hole?: number;

    /** Date de la partie */
    playing_date?: Date;

    /** Statut de la carte (Draft, Completed, etc.) */
    status?: ScoreCardStatus;

    /** Joueurs associés */
    players?: {
        user_id: string;
        handicap: number;
    }[];

    /** Score total */
    total_score?: number;

    /** Résultats trou par trou */
    holes?: HoleScorecardSchemaInterface[];
}

export type scorecardModificationResponse = successResponse