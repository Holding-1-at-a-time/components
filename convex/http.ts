import type { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const validateRequest = async (req: Request): Promise<WebhookEvent | undefined> => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
    if (!webhookSecret) {
        throw new Error("CLERK_WEBHOOK_SECRET is not defined");
    }
    const payloadString = await req.text();
    const headerPayload = req.headers;
    const svixHeaders = {
        "svix-id": headerPayload.get("svix-id")!,
        "svix-timestamp": headerPayload.get("svix-timestamp")!,
        "svix-signature": headerPayload.get("svix-signature")!,
    };
    const wh = new Webhook(webhookSecret);
    const event = wh.verify(payloadString, svixHeaders);
    return event as unknown as WebhookEvent;
};

const handleClerkWebhook = httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
        return new Response("Invalid request", { status: 400 });
    }
    switch (event.type) {
        case "user.created":
            await ctx.runMutation(internal.users.createUser, {
                clerkId: event.data.id,
                email: event.data.email_addresses[0].email_address,
                imageUrl: event.data.image_url,
                name: event.data.first_name!,
            });
            break;
        case "user.updated":
            await ctx.runMutation(internal.users.updateUser, {
                clerkId: event.data.id,
                imageUrl: event.data.image_url,
                email: event.data.email_addresses[0].email_address,
            });
            break;
        case "user.deleted":
            await ctx.runMutation(internal.users.deleteUser, {
                clerkId: event.data.id as string,
            });
            break;
        case "email.created":
            await ctx.runMutation(internal.emails.createEmail, {
                emailId: event.data.id,
                to: event.data.to_email_address,
                from: event.data.from_email_name,
                subject: event.data.subject,
                body: event.data.body,
                bodyPlain: event.data.body_plain,
            });
            break;
        case "organization.created":
            await ctx.runMutation(internal.organizations.createOrganization, {
                organizationId: event.data.id,
                name: event.data.name,
                imageUrl: event.data.image_url,
                logoUrl: event.data.logo_url,
                createdBy: event.data.created_by,
            });
            break;
        case "organization.updated":
            await ctx.runMutation(internal.organizations.updateOrganization, {
                organizationId: event.data.id,
                name: event.data.name,
                imageUrl: event.data.image_url,
                logoUrl: event.data.logo_url,
            });
            break;
        case "organization.deleted":
            await ctx.runMutation(internal.organizations.deleteOrganization, {
                organizationId: event.data.id,
            });
            break;
        case "organizationDomain.created":
            await ctx.runMutation(internal.organizationDomains.createOrganizationDomain, {
                domainId: event.data.id,
                organizationId: event.data.organization_id,
                name: event.data.name,
                verificationStatus: event.data.verification.status,
            });
            break;
        case "organizationDomain.updated":
            await ctx.runMutation(internal.organizationDomains.updateOrganizationDomain, {
                domainId: event.data.id,
                organizationId: event.data.organization_id,
                name: event.data.name,
                verificationStatus: event.data.verification.status,
            });
            break;
        case "organizationDomain.deleted":
            await ctx.runMutation(internal.organizationDomains.deleteOrganizationDomain, {
                domainId: event.data.id,
            });
            break;
        case "organizationInvitation.created":
            await ctx.runMutation(internal.organizationInvitations.createOrganizationInvitation, {
                invitationId: event.data.id,
                organizationId: event.data.organization_id,
                emailAddress: event.data.email_address,
                role: event.data.role,
                status: event.data.status,
            });
            break;
        case "organizationInvitation.accepted":
            await ctx.runMutation(internal.organizationInvitations.acceptOrganizationInvitation, {
                invitationId: event.data.id,
                organizationId: event.data.organization_id,
                emailAddress: event.data.email_address,
                role: event.data.role,
            });
            break;
        case "organizationInvitation.revoked":
            await ctx.runMutation(internal.organizationInvitations.revokeOrganizationInvitation, {
                invitationId: event.data.id,
                organizationId: event.data.organization_id,
                emailAddress: event.data.email_address,
                role: event.data.role,
            });
            break;
        case "organizationMembership.created":
            await ctx.runMutation(internal.organizationMemberships.createOrganizationMembership, {
                membershipId: event.data.id,
                organizationId: event.data.organization.id,
                userId: event.data.public_user_data.user_id,
                role: event.data.role,
            });
            break;
        case "organizationMembership.updated":
            await ctx.runMutation(internal.organizationMemberships.updateOrganizationMembership, {
                membershipId: event.data.id,
                organizationId: event.data.organization.id,
                userId: event.data.public_user_data.user_id,
                role: event.data.role,
            });
            break;
        case "organizationMembership.deleted":
            await ctx.runMutation(internal.organizationMemberships.deleteOrganizationMembership, {
                membershipId: event.data.id,
            });
            break;
        case "permission.created":
            await ctx.runMutation(internal.permissions.createPermission, {
                permissionId: event.data.id,
                name: event.data.name,
                description: event.data.description,
                key: event.data.key,
            });
            break;
        case "permission.updated":
            await ctx.runMutation(internal.permissions.updatePermission, {
                permissionId: event.data.id,
                name: event.data.name,
                description: event.data.description,
                key: event.data.key,
            });
            break;
        case "permission.deleted":
            await ctx.runMutation(internal.permissions.deletePermission, {
                permissionId: event.data.id,
            });
            break;
        case "role.created":
            await ctx.runMutation(internal.roles.createRole, {
                roleId: event.data.id,
                name: event.data.name,
                description: event.data.description,
                key: event.data.key,
            });
            break;
        case "role.updated":
            await ctx.runMutation(internal.roles.updateRole, {
                roleId: event.data.id,
                name: event.data.name,
                description: event.data.description,
                key: event.data.key,
            });
            break;
        case "role.deleted":
            await ctx.runMutation(internal.roles.deleteRole, {
                roleId: event.data.id,
            });
            break;
        case "session.created":
            await ctx.runMutation(internal.sessions.createSession, {
                sessionId: event.data.id,
                userId: event.data.user_id,
                status: event.data.status,
                createdAt: event.data.created_at,
                lastActiveAt: event.data.last_active_at,
            });
            break;
        case "session.ended":
            await ctx.runMutation(internal.sessions.endSession, {
                sessionId: event.data.id,
                userId: event.data.user_id,
                status: event.data.status,
                createdAt: event.data.created_at,
                lastActiveAt: event.data.last_active_at,
            });
            break;
        case "session.removed":
            await ctx.runMutation(internal.sessions.removeSession, {
                sessionId: event.data.id,
                userId: event.data.user_id,
                status: event.data.status,
                createdAt: event.data.created_at,
                lastActiveAt: event.data.last_active_at,
            });
            break;
        case "session.revoked":
            await ctx.runMutation(internal.sessions.revokeSession, {
                sessionId: event.data.id,
                userId: event.data.user_id,
                status: event.data.status,
                createdAt: event.data.created_at,
                lastActiveAt: event.data.last_active_at,
            });
            break;
        case "sms.created":
            await ctx.runMutation(internal.sms.createSms, {
                smsId: event.data.id,
                to: event.data.to_phone_number,
                from: event.data.from_phone_number,
                message: event.data.message,
                status: event.data.status,
            });
            break;
        default:
            console.warn(`Unhandled event type: ${event.type}`);
    }
    return new Response(null, { status: 200 });
});

export default handleClerkWebhook;
