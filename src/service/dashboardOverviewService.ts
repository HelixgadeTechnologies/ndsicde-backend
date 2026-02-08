import { PrismaClient } from '@prisma/client';
import { getTimeAgo } from "../utils/timeAgo";

const prisma = new PrismaClient();
/**
 * Get dashboard overview statistics
 */
export async function getDashboardStats() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Total Projects
    const totalProjects = await prisma.project.count();
    const lastMonthProjects = await prisma.project.count({
        where: { createAt: { gte: lastMonth } }
    });
    const projectsGrowth = lastMonthProjects > 0
        ? `+ ${Math.round((lastMonthProjects / Math.max(totalProjects - lastMonthProjects, 1)) * 100)}% since last month`
        : '0% since last month';

    // Team Members
    const totalTeamMembers = await prisma.teamMember.count();
    const lastMonthTeamMembers = await prisma.teamMember.count({
        where: { createAt: { gte: lastMonth } }
    });
    const teamMembersGrowth = lastMonthTeamMembers > 0
        ? `+ ${Math.round((lastMonthTeamMembers / Math.max(totalTeamMembers - lastMonthTeamMembers, 1)) * 100)}% since last month`
        : '0% since last month';

    // Active Organizational KPIs
    const totalKpis = await prisma.kpi.count();
    const lastMonthKpis = await prisma.kpi.count({
        where: { createAt: { gte: lastMonth } }
    });
    const kpisGrowth = lastMonthKpis > 0
        ? `+ ${Math.round((lastMonthKpis / Math.max(totalKpis - lastMonthKpis, 1)) * 100)}% since last month`
        : '0% since last month';

    // Financial Requests (pending approval)
    const financialRequests = await prisma.request.count({
        where: { status: { in: ['Pending', 'pending'] } }
    });
    const pendingApprovalCount = await prisma.request.count({
        where: {
            status: { in: ['Pending', 'pending'] },
            approval_A: { not: 1 }
        }
    });
    const financialRequestsStatus = pendingApprovalCount > 0
        ? `+ ${pendingApprovalCount} pending approval`
        : 'All approved';

    // Upcoming Deadlines (activities ending within next 7 days)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = await prisma.activity.count({
        where: {
            endDate: {
                gte: now,
                lte: nextWeek
            }
        }
    });
    const upcomingDeadlinesStatus = upcomingDeadlines > 0
        ? `+ ${upcomingDeadlines} this week`
        : 'None this week';

    // Pending Reviews (indicator reports awaiting review)
    const pendingReviews = await prisma.indicatorReport.count({
        where: { status: { in: ['Pending', 'pending', 'Submitted'] } }
    });
    const awaitingAction = await prisma.request.count({
        where: { status: { in: ['Pending', 'pending'] } }
    });
    const pendingReviewsStatus = awaitingAction > 0
        ? `+ ${awaitingAction} awaiting action`
        : 'All reviewed';

    return {
        totalProjects: {
            count: totalProjects,
            trend: projectsGrowth
        },
        teamMembers: {
            count: totalTeamMembers,
            trend: teamMembersGrowth
        },
        activeKpis: {
            count: totalKpis,
            trend: kpisGrowth
        },
        financialRequests: {
            count: financialRequests,
            trend: financialRequestsStatus
        },
        upcomingDeadlines: {
            count: upcomingDeadlines,
            trend: upcomingDeadlinesStatus
        },
        pendingReviews: {
            count: pendingReviews,
            trend: pendingReviewsStatus
        }
    };
}

/**
 * Get recent activities from multiple sources
 */
export async function getRecentActivities(params: {
    limit?: number;
    projectId?: string;
    days?: number;
}) {
    const { limit = 20, projectId, days } = params;
    const activities: any[] = [];

    // Calculate date filter if days is provided
    const dateFilter = days ? {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    } : undefined;

    const whereClause = projectId ? { projectId } : {};
    const dateWhereClause = dateFilter ? { createAt: dateFilter } : {};

    // Fetch from Project
    const projects = await prisma.project.findMany({
        where: { ...whereClause, ...dateWhereClause },
        orderBy: { createAt: 'desc' },
        take: 5,
        select: {
            projectId: true,
            projectName: true,
            createAt: true
        }
    });

    projects.forEach(project => {
        activities.push({
            activityId: project.projectId,
            activityType: 'project',
            title: 'New Project Created',
            description: project.projectName || 'Untitled Project',
            actor: 'System',
            projectName: project.projectName,
            projectId: project.projectId,
            timestamp: project.createAt,
            timeAgo: getTimeAgo(project.createAt!)
        });
    });

    // Fetch from Activity
    const activityRecords = await prisma.activity.findMany({
        where: { ...whereClause, ...dateWhereClause },
        orderBy: { createAt: 'desc' },
        take: 5,
        include: {
            project: {
                select: { projectName: true }
            }
        }
    });

    activityRecords.forEach(activity => {
        activities.push({
            activityId: activity.activityId,
            activityType: 'activity',
            title: 'Activity Added',
            description: activity.activityStatement || 'New activity',
            actor: activity.responsiblePerson || 'Unknown',
            projectName: activity.project?.projectName,
            projectId: activity.projectId,
            timestamp: activity.createAt,
            timeAgo: getTimeAgo(activity.createAt!)
        });
    });

    // Fetch from ActivityReport
    const activityReports = await prisma.activityReport.findMany({
        where: dateFilter ? { updateAt: dateFilter } : {},
        orderBy: { updateAt: 'desc' },
        take: 5,
        include: {
            activity: {
                include: {
                    project: {
                        select: { projectName: true, projectId: true }
                    }
                }
            }
        }
    });

    activityReports.forEach(report => {
        if (projectId && report.activity?.projectId !== projectId) return;

        activities.push({
            activityId: report.activityReportId,
            activityType: 'activity_report',
            title: 'Activity Progress Updated',
            description: `${report.percentageCompletion || 0}% complete`,
            actor: 'System',
            projectName: report.activity?.project?.projectName,
            projectId: report.activity?.projectId,
            timestamp: report.updateAt,
            timeAgo: getTimeAgo(report.updateAt!)
        });
    });

    // Fetch from Request
    const requests = await prisma.request.findMany({
        where: { ...whereClause, ...dateWhereClause },
        orderBy: { createAt: 'desc' },
        take: 5,
        include: {
            project: {
                select: { projectName: true }
            }
        }
    });

    requests.forEach(request => {
        activities.push({
            activityId: request.requestId,
            activityType: 'request',
            title: 'Request Submitted',
            description: `${request.activityTitle || 'Fund Request'} - ${request.status || 'Pending'}`,
            actor: request.staff || 'Unknown',
            projectName: request.project?.projectName,
            projectId: request.projectId,
            timestamp: request.createAt,
            timeAgo: getTimeAgo(request.createAt!)
        });
    });

    // Fetch from TeamMember
    const teamMembers = await prisma.teamMember.findMany({
        where: { ...whereClause, ...dateWhereClause },
        orderBy: { createAt: 'desc' },
        take: 5,
        include: {
            project: {
                select: { projectName: true }
            }
        }
    });

    teamMembers.forEach(member => {
        activities.push({
            activityId: member.teamMemberId,
            activityType: 'team_member',
            title: 'Team Member Added',
            description: `${member.fullName || 'New member'} joined as ${member.roleId || 'team member'}`,
            actor: 'System',
            projectName: member.project?.projectName,
            projectId: member.projectId,
            timestamp: member.createAt,
            timeAgo: getTimeAgo(member.createAt!)
        });
    });

    // Fetch from IndicatorReport
    const indicatorReports = await prisma.indicatorReport.findMany({
        where: dateWhereClause,
        orderBy: { createAt: 'desc' },
        take: 5
    });

    indicatorReports.forEach(report => {
        activities.push({
            activityId: report.indicatorReportId,
            activityType: 'indicator_report',
            title: 'Indicator Report Submitted',
            description: report.indicatorStatement || 'New indicator report',
            actor: report.responsiblePersons || 'Unknown',
            timestamp: report.createAt,
            timeAgo: getTimeAgo(report.createAt!)
        });
    });

    // Sort all activities by timestamp and apply limit
    const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
        .slice(0, limit);

    return sortedActivities;
}

/**
 * Get pending activity fund requests
 */
export async function getPendingActivityFundRequests(limit: number = 5) {
    const requests = await prisma.request.findMany({
        where: {
            status: { in: ['Pending', 'pending'] }
        },
        orderBy: { createAt: 'desc' },
        take: limit,
        include: {
            project: {
                select: { projectName: true }
            }
        }
    });

    return requests.map(request => ({
        requestId: request.requestId,
        title: request.activityTitle || 'Fund Request',
        projectName: request.project?.projectName || 'Unknown Project',
        status: request.status || 'Pending',
        createdAt: request.createAt,
        timeAgo: getTimeAgo(request.createAt!)
    }));
}

/**
 * Get pending report approvals
 */
export async function getPendingReportApprovals(limit: number = 5) {
    const reports = await prisma.indicatorReport.findMany({
        where: {
            status: { in: ['Pending', 'pending', 'Submitted'] }
        },
        orderBy: { createAt: 'desc' },
        take: limit
    });

    return reports.map(report => ({
        reportId: report.indicatorReportId,
        title: report.indicatorStatement || 'Indicator Report',
        type: report.thematicAreasOrPillar || 'General',
        status: report.status || 'Pending',
        createdAt: report.createAt,
        timeAgo: getTimeAgo(report.createAt!)
    }));
}
