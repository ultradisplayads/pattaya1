'use client';

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IsolatedVoteButton } from "@/components/ui/isolated-vote-button";
import { NewsArticle } from '@/lib/news-api';
import { Pin, ThumbsUp, ThumbsDown, ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BreakingNewsCardProps {
  article: NewsArticle;
  onPin?: (id: string) => void;
  onUnpin?: (id: string) => void;
  onUpvote?: (id: string) => void;
  onDownvote?: (id: string) => void;
  onHide?: (id: string) => void;
  showActions?: boolean;
  showModeration?: boolean;
}

export function BreakingNewsCard({
  article,
  onPin,
  onUnpin,
  onUpvote,
  onDownvote,
  onHide,
  showActions = true,
  showModeration = false,
}: BreakingNewsCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (isVoting) return;
    setIsVoting(true);
    try {
      if (type === 'upvote' && onUpvote) {
        await onUpvote(article.id);
      } else if (type === 'downvote' && onDownvote) {
        await onDownvote(article.id);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handlePin = async () => {
    if (isPinning) return;
    setIsPinning(true);
    try {
      if (article.isPinned && onUnpin) {
        await onUnpin(article.id);
      } else if (!article.isPinned && onPin) {
        await onPin(article.id);
      }
    } finally {
      setIsPinning(false);
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${article.isPinned ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
            {article.Title}
          </CardTitle>
          {article.isPinned && (
            <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
              <Pin className="h-3 w-3" />
              Pinned
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {((article as any).image || article.ImageURL) && (
          <div className="w-full">
            <img
              src={(article as any).image || article.ImageURL}
              alt={(article as any).imageAlt || article.Title}
              className="w-full h-32 object-cover rounded-xl shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {(article as any).imageCaption && (
              <p className="text-xs text-gray-500 italic mt-1">
                {(article as any).imageCaption}
              </p>
            )}
          </div>
        )}

        <p className="text-muted-foreground line-clamp-3">
          {article.Description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {article.apiSource}
            </Badge>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(article.PublishedAt), { addSuffix: true })}
            </div>
          </div>
          <IsolatedVoteButton 
            article={article}
            onVoteUpdate={(articleKey: string | number, voteData: {upvotes: number, downvotes: number, voteScore: number}) => {
              // Update parent component state if needed
              console.log(`Vote updated for article ${articleKey}:`, voteData);
            }}
          />
        </div>

        {showActions && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('upvote')}
                disabled={isVoting}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                {article.upvotes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('downvote')}
                disabled={isVoting}
                className="flex items-center gap-1"
              >
                <ThumbsDown className="h-4 w-4" />
                {article.downvotes}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePin}
                disabled={isPinning}
                className="flex items-center gap-1"
              >
                <Pin className="h-4 w-4" />
                {article.isPinned ? 'Unpin' : 'Pin'}
              </Button>
              {showModeration && onHide && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onHide(article.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  Hide
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a
                  href={article.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Read More
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
