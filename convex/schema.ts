import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    analytics: defineTable({
        amount: v.float64(),
        client: v.id("clients"),
        createdAt: v.float64(),
        currency: v.string(),
        date: v.float64(),
        description: v.string(),
        invoice: v.id("invoice"),
        invoiceStatus: v.string(),
        metric: v.string(),
        organizationId: v.id("organization"),
        total: v.float64(),
        totalDiscounts: v.float64(),
        totalTax: v.float64(),
        updatedAt: v.optional(v.float64()),
        value: v.float64(),
    })
        .index("by_clientId_invoiceId", ["client", "invoice"])
        .index("by_date", ["date"])
        .index("by_invoiceId", ["invoice"])
        .index("by_invoiceStatus", ["invoiceStatus"])
        .index("by_metric", ["metric"])
        .index("by_organizationId", ["organizationId"]),
    appointment: defineTable({
        appointmentId: v.id("appointments"),
        clientId: v.id("clients"),
        createdAt: v.float64(),
        description: v.string(),
        duration: v.float64(),
        employeeId: v.id("users"),
        endDate: v.float64(),
        endTime: v.float64(),
        isAvailable: v.boolean(),
        organizationId: v.id("organization"),
        serviceId: v.id("services"),
        startDate: v.float64(),
        startTime: v.float64(),
        status: v.string(),
        suppliesUsed: v.string(),
    })
        .index("by_appointmentId", ["appointmentId"])
        .index("by_clientId", ["clientId"])
        .index("by_employeeId", ["employeeId"])
        .index("by_organizationId", ["organizationId"])
        .index("by_serviceId", ["serviceId"])
        .index("by_status", ["status"]),
    assessments: defineTable({
        assessmentData: v.array(
            v.object({
                estimatedPrice: v.optional(v.float64()),
                serviceId: v.id("services"),
                status: v.union(
                    v.literal("pending"),
                    v.literal("completed")
                ),
                vehicleBodyType: v.string(),
                vehicleColor: v.string(),
                vehicleLicensePlate: v.string(),
                vehicleMake: v.string(),
                vehicleModel: v.string(),
                vehicleVin: v.string(),
                vehicleYear: v.float64(),
            })
        ),
        assessmentId: v.id("assessments"),
        clientAddress: v.string(),
        clientEmail: v.string(),
        clientName: v.string(),
        imageUrl: v.string(),
        images: v.string(),
        notes: v.string(),
        organizationId: v.id("organization"),
        updatedAt: v.float64(),
        vehicleId: v.id("vehicles"),
        videoUrl: v.string(),
    })
        .index("by_assessmentId", ["assessmentId"])
        .index("by_organizationId", ["organizationId"])
        .index("by_vehicleId", ["vehicleId"]),
    clients: defineTable({
        createdAt: v.float64(),
        email: v.string(),
        name: v.string(),
        organizationId: v.id("organization"),
        phone: v.string(),
        updatedAt: v.float64(),
    })
        .index("by_name", ["name"])
        .index("by_organizationId", ["organizationId"])
        .index("email", ["email"]),
    communications: defineTable({
        clientId: v.id("clients"),
        createdAt: v.float64(),
        message: v.string(),
        organizationId: v.id("organization"),
        type: v.string(),
        updatedAt: v.float64(),
        userId: v.id("users"),
    })
        .index("by_clientId", ["clientId"])
        .index("by_organizationId", ["organizationId"])
        .index("by_userId", ["userId"]),
    emails: defineTable({
        body: v.string(),
        bodyPlain: v.string(),
        emailId: v.string(),
        from: v.string(),
        subject: v.string(),
        to: v.string(),
    }),
    employeeSchedules: defineTable({
        createdAt: v.float64(),
        employeeId: v.id("users"),
        endTime: v.float64(),
        organizationId: v.id("organization"),
        startTime: v.float64(),
        updatedAt: v.float64(),
    })
        .index("by_employee", ["employeeId"])
        .index("by_organization", ["organizationId"]),
    estimates: defineTable({
        assessmentId: v.id("assessments"),
        createdAt: v.float64(),
        lineItems: v.union(
            v.object({
                adjustments: v.array(
                    v.object({
                        adjustment: v.float64(),
                        factor: v.string(),
                    })
                ),
                basePrice: v.float64(),
                finalPrice: v.float64(),
                serviceId: v.id("services"),
                serviceName: v.string(),
            })
        ),
        organizationId: v.id("organization"),
        totalPrice: v.float64(),
    })
        .index("by_assessmentId", ["assessmentId"])
        .index("by_organizationId", ["organizationId"]),
    invoices: defineTable({
        amount: v.float64(),
        appointment: v.id("appointments"),
        client: v.id("clients"),
        createdAt: v.float64(),
        currency: v.string(),
        description: v.string(),
        organization: v.id("organization"),
        status: v.string(),
        stripeInvoiceId: v.string(),
        total: v.float64(),
        totalDiscounts: v.float64(),
        totalTax: v.float64(),
        updatedAt: v.float64(),
    })
        .index("by_appointmentId", ["appointment"])
        .index("by_appointmentId_organizationId", [
            "appointment",
            "organization",
        ])
        .index("by_clientId", ["client"])
        .index("by_clientId_organizationId", [
            "client",
            "organization",
        ])
        .index("by_organizationId", ["organization"])
        .index("by_status", ["status"])
        .index("by_status_clientId_appointmentId", [
            "status",
            "client",
            "appointment",
        ]),
    organizationDomains: defineTable({
        domainId: v.string(),
        name: v.string(),
        organizationId: v.string(),
        verificationStatus: v.string(),
    }),
    organizationMemberships: defineTable({
        membershipId: v.string(),
        organizationId: v.string(),
        role: v.string(),
        userId: v.string(),
    }),
    organizations: defineTable({
        createdAt: v.float64(),
        createdBy: v.id("users"),
        email: v.string(),
        imageUrl: v.string(),
        logoUrl: v.string(),
        metadata: v.object({
            description: v.string(),
            email: v.string(),
            imageUrl: v.string(),
            name: v.string(),
            ownerId: v.string(),
            phone: v.string(),
            updatedAt: v.float64(),
        }),
        organizationId: v.id("organization"),
        organizationName: v.string(),
        organizationSlug: v.string(),
        ownersName: v.string(),
    }).index("by_organizationSlug_organizationId", [
        "organizationSlug",
        "organizationId",
    ]),
    payments: defineTable({
        amount: v.float64(),
        clientId: v.id("client"),
        createdAt: v.float64(),
        currency: v.string(),
        description: v.string(),
        invoiceId: v.id("invoices"),
        organizationId: v.id("organization"),
        status: v.string(),
        stripePaymentIntentId: v.string(),
        updatedAt: v.float64(),
    })
        .index("by_invoice", ["invoiceId"])
        .index("by_organization", ["organizationId"]),
    permissions: defineTable({
        description: v.string(),
        key: v.string(),
        name: v.string(),
        permissionId: v.string(),
    }),
    roles: defineTable({
        description: v.string(),
        key: v.string(),
        name: v.string(),
        roleId: v.string(),
    }),
    services: defineTable({
        basePrice: v.float64(),
        createdAt: v.float64(),
        description: v.string(),
        duration: v.float64(),
        imageUrl: v.string(),
        organizationId: v.id("organization"),
        pricingLogic: v.object({
            factors: v.array(
                v.object({
                    options: v.optional(v.array(v.string())),
                    organizationId: v.id("organization"),
                    price: v.float64(),
                    priceModifier: v.float64(),
                    serviceName: v.string(),
                    type: v.union(
                        v.literal("boolean"),
                        v.literal("number"),
                        v.literal("select")
                    ),
                    updatedAt: v.float64(),
                })
            ),
        }),
    })
        .index("by_basePrice", ["basePrice"])
        .index("by_description", ["description"])
        .index("by_duration", ["duration"])
        .index("by_organization", ["organizationId"]),
    sessions: defineTable({
        createdAt: v.float64(),
        lastActiveAt: v.float64(),
        sessionId: v.string(),
        status: v.string(),
        userId: v.string(),
    }),
    sms: defineTable({
        from: v.string(),
        message: v.string(),
        smsId: v.string(),
        status: v.string(),
        to: v.string(),
    }),
    users: defineTable({
        clerkId: v.id("user"),
        createdAt: v.float64(),
        email: v.string(),
        imageUrl: v.string(),
        name: v.string(),
        organizationId: v.id("organization"),
        updatedAt: v.float64(),
    })
        .index("by_email", ["email"])
        .index("by_name_clerkId", ["email", "clerkId"]),

    organizationInvitations: defineTable({
        emailAddress: v.string(),
        invitationId: v.string(),
        organizationId: v.string(),
        role: v.string(),
        status: v.string(),
        inviterUserId: v.string(),
        expiresAt: v.float64(),
        createdAt: v.float64(),
    })
        .index("by_emailAddress", ["emailAddress"])
        .index("by_organizationId", ["organizationId"])
        .index("by_status", ["status"]),
});