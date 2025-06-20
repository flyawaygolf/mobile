export enum ReportReason {
    // User reports
    HARASSMENT = 1,
    SPAM = 2,
    HATE_SPEECH = 3,
    INAPPROPRIATE_CONTENT = 4,
    IMPERSONATION = 5,
    SCAM_FRAUD = 6,
    UNDERAGE = 7,
    SELF_HARM = 8,
    VIOLENCE_THREATS = 9,
    ILLEGAL_CONTENT = 10,

    // Post reports
    NSFW_NOT_MARKED = 11,
    COPYRIGHT_INFRINGEMENT = 12,
    MISINFORMATION = 13,
    POLITICAL_CONTENT = 14,
    COMMERCIAL_SPAM = 15,

    // Message reports
    GUILD_RULE_VIOLATION = 16,
    INAPPROPRIATE_CHANNEL = 17,
    FLOODING = 18,
    BOT_ABUSE = 19,
    OTHER = 99
}