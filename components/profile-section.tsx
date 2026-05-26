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
    try {
      await updateProfile(bio);
      setIsEditingBio(false);
    } catch (error) {
      console.error("Failed to update bio:", error);
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
      <div className="w-full max-w-md text-center">
        {isEditable && isEditingBio ? (
          <div className="space-y-2">
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="소개글을 작성해주세요..."
              className="min-h-[80px] resize-none border-white/10 bg-white/5 text-center"
              maxLength={200}
            />
            <div className="flex justify-center gap-2">
              <Button
                size="sm"
                onClick={handleSaveBio}
                className="gap-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
              >
                <Check className="h-3 w-3" />
                저장
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditingBio(false);
                  setBio(profile.bio || "");
                }}
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className="group relative">
            <p className="text-sm text-muted-foreground">
              {profile.bio || (isEditable ? "소개글을 작성해주세요..." : "")}
            </p>
            {isEditable && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-8 top-0 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => setIsEditingBio(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
