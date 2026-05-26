"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Pencil } from "lucide-react";
import { updateProfile } from "@/app/manage/actions";

interface ProfileSectionProps {
  profile: {
    avatar_url: string;
    display_name: string;
    username: string;
    bio: string;
  };
  isEditable: boolean;
}

export function ProfileSection({ profile, isEditable }: ProfileSectionProps) {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(profile.bio || "");

  const handleSaveBio = async () => {
    if (bio === (profile.bio || "")) {
      setIsEditingBio(false);
      return;
    }
    try {
      await updateProfile(bio);
      setIsEditingBio(false);
    } catch (error) {
      console.error("Failed to update bio:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveBio();
    } else if (e.key === "Escape") {
      setIsEditingBio(false);
      setBio(profile.bio || "");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Avatar */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 opacity-75 blur-sm" />
        <Avatar className="relative h-24 w-24 ring-2 ring-background">
          <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-2xl text-white">
            {profile.display_name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{profile.display_name}</h1>
        <p className="text-sm text-muted-foreground">@{profile.username}</p>
      </div>

      {/* Bio */}
      <div className="w-full max-w-md">
        {isEditable && isEditingBio ? (
          <div className="space-y-1 text-center">
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="소개글을 작성해주세요..."
              className="min-h-[80px] resize-none border-white/10 bg-white/5 text-center focus-visible:ring-violet-500/50"
              maxLength={200}
              autoFocus
              onBlur={handleSaveBio}
              onKeyDown={handleKeyDown}
            />
            <p className="text-[10px] text-muted-foreground/50 text-right pr-1">
              빈 곳을 누르거나 Enter로 저장 (줄바꿈: Shift+Enter, 취소: Esc)
            </p>
          </div>
        ) : (
          <div 
            onClick={() => isEditable && setIsEditingBio(true)}
            className={`group relative text-center ${
              isEditable 
                ? "cursor-pointer rounded-xl border border-dashed border-transparent hover:border-white/10 hover:bg-white/5 px-4 py-3 transition-all duration-200" 
                : ""
            }`}
          >
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {profile.bio || (isEditable ? "클릭하여 소개글을 입력하세요... ✨" : "")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
