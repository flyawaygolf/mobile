export const UserFlags = {
  FLYAWAY_EMPLOYEE: 1 << 0, // Employee account
  VERIFIED_USER: 1 << 2, // Certified account
  PREMIUM_USER: 1 << 3, // Premium level 1 account
  EARLY_SUPPORTER: 1 << 4, // Early supporter account
  CERTIFIED_MODERATOR: 1 << 5, // Certified moderator account
};

export default UserFlags;
