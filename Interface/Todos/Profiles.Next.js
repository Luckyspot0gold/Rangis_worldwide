interface Profile {
  displayName: string;
  bio: string;
  avatar: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}
