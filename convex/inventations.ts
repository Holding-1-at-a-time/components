import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createInvitation = mutation({
    args: {
        emailAddress: v.string(),
        organizationId: v.id('organizations'),
        role: v.string(),
        inviterUserId: v.string(),
    },
    handler: async (ctx, args) => {
        const { emailAddress, organizationId, role, inviterUserId } = args;

        const existingInvitation = await ctx.db
            .query("organizationInvitations")
            .filter(q => q.eq(q.field("emailAddress"), emailAddress))
            .filter(q => q.eq(q.field("organizationId"), organizationId))
            .filter(q => q.eq(q.field("status"), "pending"))
            .first();

        if (existingInvitation) {
            throw new Error("An invitation for this email already exists");
        }

        const invitationId = await ctx.db.insert("organizationInvitations", {
            emailAddress,
            organizationId,
            role,
            inviterUserId,
            status: "pending",
            invitationId: ctx.db.newId().toString(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
            createdAt: Date.now(),
        });

        // TODO: Send invitation email

        return invitationId;
    },
});

export const acceptInvitation = mutation({
    args: { invitationId: v.string() },
    handler: async (ctx, args) => {
        const invitation = await ctx.db
            .query("organizationInvitations")
            .filter(q => q.eq(q.field("invitationId"), args.invitationId))
            .first();

        if (!invitation) {
            throw new Error("Invitation not found");
        }

        if (invitation.status !== "pending") {
            throw new Error("Invitation is no longer valid");
        }

        if (invitation.expiresAt < Date.now()) {
            throw new Error("Invitation has expired");
        }

        await ctx.db.patch(invitation._id, { status: "accepted" });

        const user = await ctx.db
            .query("users")
            .filter(q => q.eq(q.field("email"), invitation.emailAddress))
            .first();

        if (!user) {
            const newUserId = await ctx.db.insert("users", {
                email: invitation.emailAddress,
                emailVerified: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            await ctx.db.patch(newUserId, {
                organizationMemberships: [{
                    organizationId: invitation.organizationId,
                    role: invitation.role,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                }],
            });
        } else {
            await ctx.db.patch(user._id, {
                organizationMemberships: [{
                    organizationId: invitation.organizationId,
                    role: invitation.role,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                }],
            });
        }
        return invitation.organizationId;
    },
});

export const revokeInvitation = mutation({
    args: { invitationId: v.string() },
    handler: async (ctx, args) => {
        const invitation = await ctx.db
            .query("organizationInvitations")
            .filter(q => q.eq(q.field("invitationId"), args.invitationId))
            .first();

        if (!invitation) {
            throw new Error("Invitation not found");
        }

        if (invitation.status !== "pending") {
            throw new Error("Invitation cannot be revoked");
        }

        await ctx.db.patch(invitation._id, { status: "revoked" });

        return invitation._id;
    },
});

export const listInvitations = query({
    args: { organizationId: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query("organizationInvitations")
            .filter(q => q.eq(q.field("organizationId"), args.organizationId))
            .collect();
    },
});