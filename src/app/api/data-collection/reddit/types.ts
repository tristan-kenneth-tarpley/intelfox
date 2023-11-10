export interface RedditComment {
  created_timestamp: number;
  id: string;
  post_id: string;
  score: number;
}

export interface RedditPost {
  created_timestamp: number;
  id: string;
  nsfw: boolean;
  number_comments: number;
  score: number;
  spoiler: boolean;
  subreddit_id: string;
  subreddit_name: string;
  title: string;
  type: string;
  url: string;
}

export interface SubReddit {
  id: string;
  name: string;
  nsfw: boolean;
  quarantined: boolean;
}

export type ActionInfo = unknown;

export interface RedditProfile {
  id: string;
  name: string;
  nsfw: boolean;
}

export interface RedditItemSearchContext {
  search: {
    originElement: string;
  };
}

export interface RedditCommentContextData {
  action_info: ActionInfo;
  comment: RedditComment;
  post: RedditPost;
  profile: RedditProfile;
}

export interface RedditPostContextData {
  action_info: ActionInfo;
  post: RedditPost;
  subreddit: SubReddit;
}
