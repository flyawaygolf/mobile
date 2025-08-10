import type { requestResponseInterface, userInfo } from "./Global";
import { golfInterface } from "./Golf";

// Enums pour les événements
export enum CalendarEventType {
    TOURNAMENT = 0,
    LESSON = 1,
    SOCIAL = 2,
    MEETING = 3
}

export enum CompetitionFormatEnum {
    STROKE_PLAY = 1,
    MATCH_PLAY = 2,
    STABLEFORD = 3,
    BEST_BALL = 4,
    SCRAMBLE = 5
}

export enum EventStatusEnum {
    SCHEDULED = 1,
    IN_PROGRESS = 2,
    COMPLETED = 3,
    CANCELLED = 4
}

export enum SkillLevelEnum {
    BEGINNER = 1,
    INTERMEDIATE = 2,
    ADVANCED = 3,
    PROFESSIONAL = 4
}

// Interfaces pour les sous-objets
export interface AgeRestrictionInterface {
    min_age?: number;
    max_age?: number;
}

export interface CategoryInterface {
    male: boolean;
    female: boolean;
    senior: boolean;
    kid: boolean;
}

// Interface principale des événements
export interface eventsInterface {
    event_id: string;
    owner_info: userInfo;
    golf_info: golfInterface;
    participants: number;
    joined: boolean;
    guild_id: string;
    golf_id: string;
    
    // Informations de base
    title: string;
    description: string;
    event_type: CalendarEventType;
    format: CompetitionFormatEnum;
    status: EventStatusEnum;
    official: boolean;
    
    // Dates
    start_date: string;
    end_date: string;
    registration_deadline?: string;
    
    // Participants et restrictions
    max_participants: number;
    min_handicap?: number;
    max_handicap?: number;
    skill_level?: SkillLevelEnum;
    
    // Restrictions d'âge et catégories
    age_restriction?: AgeRestrictionInterface;
    category?: CategoryInterface;
    
    // Paramètres financiers
    greenfee: number;
    entry_fee?: number;
    
    // Confidentialité et accès
    is_private: boolean;
    favorites: boolean;
    players: string[];
    
    // Règles et conditions
    special_rules?: string;
    dress_code?: boolean;
    cancellation_policy?: string;
    equipment_required?: string[];
    
    // Statut utilisateur
    joinable: boolean;
    
    // Métadonnées
    deleted: boolean;
    created_at: string;
    updated_at: string;
    distance?: number;
}

export interface postEventInterface {
    event_id: string;
    start_date: Date;
    end_date: Date;
    deleted: boolean;
}

export interface eventResponse extends requestResponseInterface<eventsInterface> {}

export interface multipleEventsResponse extends requestResponseInterface<eventsInterface[]> {}

export type eventsCreatorResponse = requestResponseInterface<eventsInterface>

export interface eventsCreatorParams {
    title: string;
    description: string;
    start_date: string | Date;
    end_date: string | Date;
    golf_id: string;
    event_type: CalendarEventType;
    format: CompetitionFormatEnum;
    max_participants: number;
    min_handicap?: number;
    max_handicap?: number;
    skill_level?: SkillLevelEnum;
    age_restriction?: AgeRestrictionInterface;
    category?: CategoryInterface;
    players?: string[];
    greenfee: number;
    entry_fee?: number;
    is_private: boolean;
    favorites?: boolean;
    special_rules?: string;
    dress_code?: boolean;
    registration_deadline?: string | Date;
    cancellation_policy?: string;
    equipment_required?: string[];
}

export interface eventsUpdateParams {
    favorites?: boolean;
    deleted?: boolean;
    status?: EventStatusEnum;
    title?: string;
    description?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    registration_deadline?: string | Date;
    max_participants?: number;
    min_handicap?: number;
    max_handicap?: number;
    skill_level?: SkillLevelEnum;
    age_restriction?: AgeRestrictionInterface;
    category?: CategoryInterface;
    greenfee?: number;
    entry_fee?: number;
    is_private?: boolean;
    special_rules?: string;
    dress_code?: boolean;
    cancellation_policy?: string;
    equipment_required?: string[];
}

export interface participantsResponse extends requestResponseInterface<userInfo[]> {}

// Helper types pour les validations
export type EventTypeKeys = keyof typeof CalendarEventType;
export type EventFormatKeys = keyof typeof CompetitionFormatEnum;
export type EventStatusKeys = keyof typeof EventStatusEnum;
export type SkillLevelKeys = keyof typeof SkillLevelEnum;

// Constantes utiles
export const EVENT_TYPE_VALUES = Object.values(CalendarEventType).filter(v => typeof v === 'number') as number[];
export const FORMAT_VALUES = Object.values(CompetitionFormatEnum).filter(v => typeof v === 'number') as number[];
export const STATUS_VALUES = Object.values(EventStatusEnum).filter(v => typeof v === 'number') as number[];
export const SKILL_LEVEL_VALUES = Object.values(SkillLevelEnum).filter(v => typeof v === 'number') as number[];