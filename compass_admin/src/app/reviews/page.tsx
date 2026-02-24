"use client";

import * as React from "react";

import {
  Badge,
  Button,
  Card,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
  AlertModal,
  LoadingSkeleton
} from "@compass/ui";
import { Trash2 } from "lucide-react";

import { PageHeader } from "../../components/ui/PageHeader";
import { createReviewLink, deleteReview, fetchReviews, updateReview } from "../../lib/api";
import { reviews as fallbackReviews } from "../../lib/mock-data";
import type { Review } from "../../lib/types";

export default function ReviewsPage() {
  const [items, setItems] = React.useState<Review[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [link, setLink] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchReviews()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  const handleGenerate = async () => {
    try {
      const token = await createReviewLink();
      const origin = window.location.origin.includes("localhost:3001")
        ? "http://localhost:3000"
        : "https://compassdigitalservices.com";
      const url = `${origin}/review?token=${token}`;
      setLink(url);
      await navigator.clipboard.writeText(url);
      toast({
        title: "Review link copied",
        description: "Share it with the client to collect feedback.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Unable to generate link",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    }
  };

  const handleCopyToken = async () => {
    if (link) {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Review link copied",
        description: "Share it with the client to collect feedback.",
        variant: "success"
      });
    } else {
      // If no link exists, generate one and then copy
      await handleGenerate();
    }
  };

  const handleStatus = async (reviewId: string, status: Review["status"]) => {
    const previous = items;
    setItems((prev) => prev.map((review) => (review.id === reviewId ? { ...review, status } : review)));
    try {
      await updateReview(reviewId, { status });
      toast({ title: "Review updated", description: "The review status was saved.", variant: "success" });
    } catch (error) {
      setItems(previous);
      toast({
        title: "Unable to update review",
        description: error instanceof Error ? error.message : "Check the API connection and try again.",
        variant: "danger"
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    console.log("handleConfirmDelete called for Review ID:", id);
    try {
      setDeleting(true);
      await deleteReview(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Review deleted", description: "The review was removed.", variant: "success" });
    } catch (error) {
      console.error("Delete review failed:", error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete review.",
        variant: "danger"
      });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description="Approve testimonials and generate feedback links."
        actionLabel="Generate link"
        onAction={handleGenerate}
      />

      {link ? (
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-text/60">Latest review link</p>
            <p className="text-sm font-semibold text-text">{link}</p>
          </div>
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(link)}>
            Copy again
          </Button>
        </Card>
      ) : null}

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-10 w-full" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            description="Invite clients to share their experience after milestones."
            actionLabel="Copy invite link"
            onAction={handleCopyToken}
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="w-[50px]">{null}</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {items.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium text-text">{review.client ?? review.name ?? "—"}</TableCell>
                  <TableCell>{review.project ?? "—"}</TableCell>
                  <TableCell>{review.serviceCategory ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        review.status === "approved"
                          ? "success"
                          : review.status === "pending"
                            ? "warning"
                            : "default"
                      }
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{review.rating} / 5</TableCell>
                  <TableCell>{review.token}</TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatus(review.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleStatus(review.id, "archived")}>
                      Archive
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-text/40 hover:text-danger"
                      onClick={() => handleDeleteClick(review.id)}
                    >
                      <Trash2 size={16} className="pointer-events-none" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <AlertModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
      />
    </div>
  );
}

