import BitField from './BitFields';
import UserFlags from './Flags';

/**
 * Data structure that makes it easy to interact with a {@link User#flags} bitfield.
 * @extends {BitField}
 */

class UserPermissions extends BitField {}

/**
 * @name UserPermissions
 * @kind constructor
 * @memberof UserPermissions
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name UserPermissions#bitfield
 */

UserPermissions.FLAGS = UserFlags;

export default UserPermissions;
