import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { PlanType, SubscriptionStatus } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get("status")
    const planTypeParam = searchParams.get("planType")

    // Build where clause
    const where: any = {}

    // Handle status filter
    if (statusParam && statusParam !== "all") {
      // Check if the value is a valid SubscriptionStatus
      const validStatuses = Object.values(SubscriptionStatus)
      if (validStatuses.includes(statusParam as SubscriptionStatus)) {
        where.status = statusParam as SubscriptionStatus
      }
    }

    // Handle planType filter
    if (planTypeParam && planTypeParam !== "all") {
      // Check if the value is a valid PlanType
      const validPlanTypes = Object.values(PlanType)
      if (validPlanTypes.includes(planTypeParam as PlanType)) {
        where.planType = planTypeParam as PlanType
      }
    }

    // Fetch subscriptions with user data
    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        payment: {
          select: {
            id: true,
            gateway: true,
            gatewayTransactionId: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform subscriptions into response format
    const formattedSubscriptions = subscriptions.map((subscription) => ({
      id: subscription.id,
      userId: subscription.userId,
      userName: `${subscription.user.firstName} ${subscription.user.lastName}`,
      userEmail: subscription.user.email || "N/A",
      userRole: subscription.user.role,
      planName: subscription.planName,
      planType: subscription.planType,
      amount: subscription.amount,
      currency: subscription.currency,
      status: subscription.status,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate.toISOString(),
      nextBillingDate: subscription.nextBillingDate?.toISOString() || null,
      autoRenew: subscription.autoRenew,
      paymentMethod: subscription.paymentMethod || "Credit Card",
      transactionId: subscription.transactionId || 
                    subscription.payment?.gatewayTransactionId || 
                    subscription.id,
      features: subscription.features,
      cancelledAt: subscription.cancelledAt?.toISOString() || null,
      cancellationReason: subscription.cancellationReason,
      createdAt: subscription.createdAt.toISOString(),
      paymentStatus: subscription.payment?.status || null,
    }))

    return NextResponse.json({
      success: true,
      subscriptions: formattedSubscriptions,
      total: formattedSubscriptions.length,
    })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch subscriptions" 
      }, 
      { status: 500 }
    )
  }
}