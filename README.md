# Chirp

## Features

- [ ] Profiles
  - [ ] Username - 32 characters [a-zA-Z0-9._-]
  - [ ] Display name - 32 characters
  - [ ] Avatar - image upload
  - [ ] Bio - 160 characters
  - [ ] Is private - boolean
  - [ ] Public profile - page that shows the user's posts, follows and followers if profile is not public
- [ ] Posts
  - [ ] Show author info
    - [ ] Avatar
    - [ ] Display name
    - [ ] Username
  - [ ] Date
  - [ ] Content
    - [ ] Text - 320 characters
    - [ ] Image
    - [ ] Link embed (spotify, youtube) _MAYBE?_
  - [ ] Replies - posts have a parent_id column that references the parent post, NULL for 'root' posts
- [ ] Likes
- [ ] Following
