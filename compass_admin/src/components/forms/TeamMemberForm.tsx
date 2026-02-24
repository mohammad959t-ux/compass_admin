"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button, Input, Textarea } from "@compass/ui";
import { useMutation } from "@tanstack/react-query";

import { createTeamMember, updateTeamMember } from "../../lib/api";
import { TeamMember } from "../../lib/types";
import { SingleImageUpload } from "../uploads/SingleImageUpload";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    role: z.string().min(2, "Role is required"),
    bio: z.string().optional(),
    imageUrl: z.string().min(1, "Image is required"),
    order: z.number().default(0),
    socials: z.object({
        linkedin: z.string().optional(),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
        website: z.string().optional()
    }).optional()
});

type FormValues = z.infer<typeof formSchema>;

interface TeamMemberFormProps {
    initialData?: TeamMember | null;
    onSuccess: () => void;
}

export function TeamMemberForm({ initialData, onSuccess }: TeamMemberFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            role: initialData?.role || "",
            bio: initialData?.bio || "",
            imageUrl: initialData?.imageUrl || "",
            order: initialData?.order || 0,
            socials: {
                linkedin: initialData?.socials?.linkedin || "",
                twitter: initialData?.socials?.twitter || "",
                instagram: initialData?.socials?.instagram || "",
                website: initialData?.socials?.website || ""
            }
        }
    });

    const createMutation = useMutation({
        mutationFn: createTeamMember,
        onSuccess
    });

    const updateMutation = useMutation({
        mutationFn: (data: Partial<TeamMember>) => updateTeamMember(initialData?._id || initialData?.id!, data),
        onSuccess
    });

    const onSubmit = (values: FormValues) => {
        if (initialData) {
            updateMutation.mutate(values);
        } else {
            createMutation.mutate(values);
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Profile Image
                </label>
                <div className="flex flex-col gap-2">
                    <SingleImageUpload
                        value={form.watch("imageUrl")}
                        onChange={(url) => form.setValue("imageUrl", url)}
                        disabled={isPending}
                    />
                    {form.formState.errors.imageUrl && (
                        <p className="text-[0.8rem] font-medium text-destructive">
                            {form.formState.errors.imageUrl.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Name
                    </label>
                    <Input
                        placeholder="John Doe"
                        {...form.register("name")}
                        disabled={isPending}
                    />
                    {form.formState.errors.name && (
                        <p className="text-[0.8rem] font-medium text-destructive">
                            {form.formState.errors.name.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Role / Title
                    </label>
                    <Input
                        placeholder="Senior Designer"
                        {...form.register("role")}
                        disabled={isPending}
                    />
                    {form.formState.errors.role && (
                        <p className="text-[0.8rem] font-medium text-destructive">
                            {form.formState.errors.role.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Short Bio
                </label>
                <Textarea
                    placeholder="Passionate about creating unique digital experiences..."
                    className="resize-none"
                    rows={4}
                    {...form.register("bio")}
                    disabled={isPending}
                />
                {form.formState.errors.bio && (
                    <p className="text-[0.8rem] font-medium text-destructive">
                        {form.formState.errors.bio.message}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Social Links (Optional)</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <div className="space-y-2">
                            <Input placeholder="LinkedIn URL" {...form.register("socials.linkedin")} disabled={isPending} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Input placeholder="Twitter / X URL" {...form.register("socials.twitter")} disabled={isPending} />
                    </div>
                    <div className="space-y-2">
                        <Input placeholder="Instagram URL" {...form.register("socials.instagram")} disabled={isPending} />
                    </div>
                    <div className="space-y-2">
                        <Input placeholder="Website URL" {...form.register("socials.website")} disabled={isPending} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Member" : "Add Member"}
                </Button>
            </div>
        </form>
    );
}
