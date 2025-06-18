import { premium_type } from "./Client/Managers/Interfaces/Global";
import { AvailabilitySlot } from "./Client/Managers/Interfaces/Me";
import UserFlags from "./Client/Permissions/Flags";
import UserPermissions from "./Client/Permissions/UserPermissions";

export const availabilityDefault: AvailabilitySlot[] = [
    {
        id: 1,
        available: false,
        start: new Date(new Date().setHours(9, 0, 0)), // 9:00 AM today
        end: new Date(new Date().setHours(17, 0, 0)),   // 5:00 PM today
    },
    {
        id: 2,
        available: false,
        start: new Date(new Date().setHours(9, 0, 0)), // 9:00 AM today
        end: new Date(new Date().setHours(17, 0, 0)),   // 5:00 PM today
    },
    {
        id: 3,
        available: false,
        start: new Date(new Date().setHours(9, 0, 0)), // 9:00 AM today
        end: new Date(new Date().setHours(17, 0, 0)),   // 5:00 PM today
    },
    {
        id: 4,
        available: false,
        start: new Date(new Date().setHours(9, 0, 0)), // 9:00 AM today
        end: new Date(new Date().setHours(17, 0, 0)),   // 5:00 PM today
    },
    {
        id: 5,
        available: false,
        start: new Date(new Date().setHours(9, 0, 0)), // 9:00 AM today
        end: new Date(new Date().setHours(17, 0, 0)),   // 5:00 PM today
    },
    {
        id: 6,
        available: true,
        start: new Date(new Date().setHours(10, 0, 0)), // 10:00 AM today
        end: new Date(new Date().setHours(14, 0, 0)),   // 2:00 PM today
    },
    {
        id: 7,
        available: true,
        start: new Date(new Date().setHours(10, 0, 0)), // 10:00 AM today
        end: new Date(new Date().setHours(14, 0, 0)),   // 2:00 PM today
    },
];

class premiumAdvantagesClass {

    private type: premium_type | 4;

    constructor(type: premium_type, flags: number) {
        const perms = new UserPermissions(flags);
        if (perms.has(UserFlags.FLYAWAY_EMPLOYEE)) this.type = 4;
        else if (perms.has(UserFlags.FLYAWAY_PARTNER)) this.type = 2
        else if (perms.has(UserFlags.PREMIUM_USER)) this.type = 1
        else if (perms.has(UserFlags.PREMIUM_2_USER)) this.type = 2
        else this.type = type;
    }

    isPremium() {
        if (this.type === 1) return true;
        if (this.type === 2) return true;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }

    textLength() {
        if (this.type === 1) return 1024;
        if (this.type === 2) return 2048;
        if (this.type === 3) return 4096;
        if (this.type === 4) return 5000;
        return 256;
    }

    fileSize() {
        if (this.type === 1) return 512;
        if (this.type === 2) return 512;
        if (this.type === 3) return 1000;
        if (this.type === 4) return 1000;
        return 50;
    }

    animatedProfileFilesAllowed() {
        if (this.type === 1) return true;
        if (this.type === 2) return true;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }

    changeAppIcon() {
        if (this.type === 1) return true;
        if (this.type === 2) return true;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }

    nftProfileFilesAllowed() {
        if (this.type === 1) return true;
        if (this.type === 2) return true;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }

    translatePosts() {
        if (this.type === 1) return true;
        if (this.type === 2) return true;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }

    showPostViews() {
        if (this.type === 1) return true;
        if (this.type === 2) return true;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }

    betterMarkdown() {
        if (this.type === 1) return true;
        if (this.type === 2) return true;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }

    showAvailability() {
        if (this.type === 1) return true;
        if (this.type === 2) return true;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }

    showLockedLocation() {
        if (this.type === 1) return true;
        if (this.type === 2) return true;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }

    withdrawCommissions() {
        return 0;
    }

    userProfileSubcriptionCommissions() {
        return false;
    }

    advancedStatistics() {
        if (this.type === 1) return false;
        if (this.type === 2) return false;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }

    copyrightProtection() {
        if (this.type === 1) return false;
        if (this.type === 2) return false;
        if (this.type === 3) return true;
        if (this.type === 4) return true;
        return false;
    }
}

export const premiumAdvantages = (premium_type: premium_type, flags: number) => new premiumAdvantagesClass(premium_type, flags);