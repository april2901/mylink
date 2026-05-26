"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, ExternalLink, MousePointerClick, Globe } from "lucide-react";
import { deleteLink, updateLink } from "@/app/manage/actions";

interface Link {
  id: string;
  title: string;
  url: string;
  click_count: number;
  position: number;
}

interface LinkBlockProps {
  link: Link;
  isOwner: boolean;
}

function getFaviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`;
  } catch {
    return "";
  }
}

export function LinkBlock({ link, isOwner }: LinkBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [isDeleting, setIsDeleting] = useState(false);
  const [faviconError, setFaviconError] = useState(!link.url);

  const handleClick = async () => {
    if (isOwner) {
      window.open(link.url, "_blank");
      return;
    }
    // Track click for non-owners
    try {
      await fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: link.id }),
      });
    } catch {
      // Silently fail
    }
    window.open(link.url, "_blank");
  };

  const handleUpdate = async () => {
    try {
      await updateLink(link.id, editTitle, editUrl);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update link:", error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLink(link.id);
    } catch (error) {
      console.error("Failed to delete link:", error);
      setIsDeleting(false);
    }
  };

  const faviconUrl = getFaviconUrl(link.url);

  return (
    <div
      className={`group relative flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all duration-300 hover:border-violet-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-violet-500/5 ${isDeleting ? "scale-95 opacity-50" : ""}`}
    >
      {/* Favicon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
        {!faviconError && faviconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={faviconUrl}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 rounded-sm object-contain"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <Globe className="h-5 w-5 text-violet-400" />
        )}
      </div>

      {/* Title + Click count */}
      <button
        onClick={handleClick}
        className="flex flex-1 items-center gap-3 text-left"
      >
        <span className="font-medium text-foreground transition-colors group-hover:text-violet-300">
          {link.title}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-muted-foreground">
          <MousePointerClick className="h-3 w-3" />
          {link.click_count}
        </span>
        <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      {/* Owner actions */}
      {isOwner && (
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {/* Edit dialog */}
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-blue-400"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setEditTitle(link.title);
                    setEditUrl(link.url);
                  }}
                />
              }
            >
              <Pencil className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent className="border-white/10 bg-card/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle>링크 수정</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">제목</Label>
                  <Input
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="링크 제목"
                    className="border-white/10 bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-url">URL</Label>
                  <Input
                    id="edit-url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="border-white/10 bg-white/5"
                  />
                </div>
                <Button
                  onClick={handleUpdate}
                  className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
                >
                  저장
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
