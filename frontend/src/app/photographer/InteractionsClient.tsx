"use client";

import { useState } from "react";

export function InteractionsClient() {
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex gap-2">
      <button
        data-liked={liked}
        className={`btn btn-sm ${liked ? "text-error" : "btn-ghost"}`}
        onClick={() => setLiked((v) => !v)}
      >
        <span
          className="iconify like-icon"
          data-icon={liked ? "heroicons:heart-solid" : "heroicons:heart"}
          data-width="16"
        ></span>
        <span className="like-text">{liked ? "已点赞" : "点赞"}</span>
      </button>
      <button
        data-following={following}
        className={`btn btn-sm ${following ? "btn-primary" : "btn-ghost"}`}
        onClick={() => setFollowing((v) => !v)}
      >
        <span
          className="iconify follow-icon"
          data-icon={following ? "heroicons:user-minus" : "heroicons:user-plus"}
          data-width="16"
        ></span>
        <span className="follow-text">{following ? "已关注" : "关注"}</span>
      </button>
    </div>
  );
}


