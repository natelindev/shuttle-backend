/**
 * @enum {item.access} Access
 *
 * @field public: everyone can access
 * @field user: every registered user
 * @field group: group owner can access
 * @field private: only the owner
 */
export const enum access {
  public = 'public',
  user = 'user',
  group = 'group',
  private = 'private'
}
