import type { requestResponseInterface } from "./Global"

// Définition du type Achievements
export type AchievementsType = {
  achievement_id: number;          // Identifiant unique du défi
  label: string;       // Nom affiché
  description?: string; // Description optionnelle
  active: boolean;   // Permet de désactiver un défi sans le supprimer
};

export enum AchievementEnum {
  CompleteFirstScorecard = 1,
  Complete10Scorecards = 2,
  MakeAPar = 3,
  MakeABirdie = 4,
  Make2ConsecutiveBirdies = 5,
  MakeAnEagle = 6,
  MakeAnAlbatross = 7,
  ScoreUnder100On18Holes = 8,
  FinishAtParOn18Holes = 9,
  FinishUnderParOn18Holes = 10,
  ReachSingleDigitHandicap = 11,
  HaveANegativeHandicap = 12,
  HoleInOne = 13,
  LongestDriveInARound = 14,
  Finish18HolesWithoutAnyBogey = 15,
  BeatYourPersonalBestScore = 16,
  PlayGolfFor3ConsecutiveDays = 17,
  PlayAllGolfCoursesInACountry = 18,
  Accumulate50BirdiesInASeason = 19,
  CreateYourFirstPost = 20,
  AddYourFirstFavorite = 21,
  JoinYourFirstEvent = 22,
  InviteAFriendToFlyAway = 23,
  PlayARoundInTheRain = 24,
  PlayOnAForeignCourse = 25,
  PostASelfieOnTheGreen = 26,
  ParticipateInAnOfficialFlyAwayTournament = 27
}

export type AchievementFetchSchema = (AchievementsType & {
    pourcentage_achieved: number;
    achieved: boolean;
    created_at: Date | null;
  })

export type AchievementFetchResponse = requestResponseInterface<AchievementFetchSchema[]>