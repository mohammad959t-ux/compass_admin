"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Button,
    Drawer,
} from "@compass/ui";
import { Copy, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { TeamMemberForm } from "../../components/forms/TeamMemberForm";
import { deleteTeamMember, fetchTeamMembers, createTeamMember, updateTeamMember } from "../../lib/api";
import { TeamMember } from "../../lib/types";

export default function TeamPage() {
    const queryClient = useQueryClient();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    const { data: members = [], isLoading } = useQuery({
        queryKey: ["teamMembers"],
        queryFn: fetchTeamMembers
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTeamMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
            toast.success("Team member deleted");
        },
        onError: () => toast.error("Failed to delete member")
    });

    const handleEdit = (member: TeamMember) => {
        setEditingMember(member);
        setIsSheetOpen(true);
    };

    const handleAddNew = () => {
        setEditingMember(null);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
                    <p className="text-muted-foreground">Manage your team members and experts.</p>
                </div>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                </Button>
            </div>

            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-64 animate-pulse rounded-lg bg-card border border-border/50" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {members.map((member) => (
                        <div
                            key={member._id || member.id}
                            className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
                        >
                            <div className="aspect-square w-full overflow-hidden bg-muted">
                                {member.imageUrl ? (
                                    <img
                                        src={member.imageUrl}
                                        alt={member.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="mb-2 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold">{member.name}</h3>
                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEdit(member)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this member?")) {
                                                    deleteMutation.mutate(member._id || member.id!);
                                                }
                                            }}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                {member.bio && (
                                    <p className="line-clamp-2 text-sm text-muted-foreground/80">{member.bio}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Drawer
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title={editingMember ? "Edit Team Member" : "Add New Team Member"}
                className="overflow-y-auto"
            >
                <div className="mt-8">
                    <TeamMemberForm
                        initialData={editingMember}
                        onSuccess={() => {
                            setIsSheetOpen(false);
                            queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
                            toast.success(editingMember ? "Member updated" : "Member added");
                        }}
                    />
                </div>
            </Drawer>
        </div>
    );
}
