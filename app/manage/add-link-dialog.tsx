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
import { Plus } from "lucide-react";
import { addLink } from "./actions";
import { isValidUrl } from "@/lib/utils";

export function AddLinkDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const isUrlValid = isValidUrl(url.trim());
  const showUrlError = url.trim().length > 0 && !isUrlValid;

  const handleSubmit = async () => {
    if (!title.trim() || !url.trim() || !isUrlValid) return;
    setLoading(true);
    try {
      await addLink(title.trim(), url.trim());
      setTitle("");
      setUrl("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to add link:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-6 text-base font-semibold shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/30" />
        }
      >
        <Plus className="h-5 w-5" />
        링크 추가
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>새 링크 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="link-title">제목</Label>
            <Input
              id="link-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 내 GitHub 프로필"
              className="border-white/10 bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username"
              className={`bg-white/5 ${showUrlError ? "border-red-500/50 focus-visible:ring-red-500/50" : "border-white/10"}`}
            />
            {showUrlError && (
              <p className="text-xs text-red-400">올바른 URL 주소 형식을 입력해 주세요 (예: example.com).</p>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !url.trim() || !isUrlValid}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
          >
            {loading ? "추가 중..." : "추가하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
