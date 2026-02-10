"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
exports.getRecentActivities = getRecentActivities;
exports.getPendingActivityFundRequests = getPendingActivityFundRequests;
exports.getPendingReportApprovals = getPendingReportApprovals;
const client_1 = require("@prisma/client");
const timeAgo_1 = require("../utils/timeAgo");
const prisma = new client_1.PrismaClient();
function getDashboardStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const totalProjects = yield prisma.project.count();
        const lastMonthProjects = yield prisma.project.count({
            where: { createAt: { gte: lastMonth } }
        });
        const projectsGrowth = lastMonthProjects > 0
            ? `+ ${Math.round((lastMonthProjects / Math.max(totalProjects - lastMonthProjects, 1)) * 100)}% since last month`
            : '0% since last month';
        const totalTeamMembers = yield prisma.teamMember.count();
        const lastMonthTeamMembers = yield prisma.teamMember.count({
            where: { createAt: { gte: lastMonth } }
        });
        const teamMembersGrowth = lastMonthTeamMembers > 0
            ? `+ ${Math.round((lastMonthTeamMembers / Math.max(totalTeamMembers - lastMonthTeamMembers, 1)) * 100)}% since last month`
            : '0% since last month';
        const totalKpis = yield prisma.kpi.count();
        const lastMonthKpis = yield prisma.kpi.count({
            where: { createAt: { gte: lastMonth } }
        });
        const kpisGrowth = lastMonthKpis > 0
            ? `+ ${Math.round((lastMonthKpis / Math.max(totalKpis - lastMonthKpis, 1)) * 100)}% since last month`
            : '0% since last month';
        const financialRequests = yield prisma.request.count({
            where: { status: { in: ['Pending', 'pending'] } }
        });
        const pendingApprovalCount = yield prisma.request.count({
            where: {
                status: { in: ['Pending', 'pending'] },
                approval_A: { not: 1 }
            }
        });
        const financialRequestsStatus = pendingApprovalCount > 0
            ? `+ ${pendingApprovalCount} pending approval`
            : 'All approved';
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcomingDeadlines = yield prisma.activity.count({
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
        const pendingReviews = yield prisma.indicatorReport.count({
            where: { status: { in: ['Pending', 'pending', 'Submitted'] } }
        });
        const awaitingAction = yield prisma.request.count({
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
    });
}
function getRecentActivities(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { limit = 20, projectId, days } = params;
        const activities = [];
        const dateFilter = days ? {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        } : undefined;
        const whereClause = projectId ? { projectId } : {};
        const dateWhereClause = dateFilter ? { createAt: dateFilter } : {};
        const projects = yield prisma.project.findMany({
            where: Object.assign(Object.assign({}, whereClause), dateWhereClause),
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
                timeAgo: (0, timeAgo_1.getTimeAgo)(project.createAt)
            });
        });
        const activityRecords = yield prisma.activity.findMany({
            where: Object.assign(Object.assign({}, whereClause), dateWhereClause),
            orderBy: { createAt: 'desc' },
            take: 5,
            include: {
                project: {
                    select: { projectName: true }
                }
            }
        });
        activityRecords.forEach(activity => {
            var _a;
            activities.push({
                activityId: activity.activityId,
                activityType: 'activity',
                title: 'Activity Added',
                description: activity.activityStatement || 'New activity',
                actor: activity.responsiblePerson || 'Unknown',
                projectName: (_a = activity.project) === null || _a === void 0 ? void 0 : _a.projectName,
                projectId: activity.projectId,
                timestamp: activity.createAt,
                timeAgo: (0, timeAgo_1.getTimeAgo)(activity.createAt)
            });
        });
        const activityReports = yield prisma.activityReport.findMany({
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
            var _a, _b, _c, _d;
            if (projectId && ((_a = report.activity) === null || _a === void 0 ? void 0 : _a.projectId) !== projectId)
                return;
            activities.push({
                activityId: report.activityReportId,
                activityType: 'activity_report',
                title: 'Activity Progress Updated',
                description: `${report.percentageCompletion || 0}% complete`,
                actor: 'System',
                projectName: (_c = (_b = report.activity) === null || _b === void 0 ? void 0 : _b.project) === null || _c === void 0 ? void 0 : _c.projectName,
                projectId: (_d = report.activity) === null || _d === void 0 ? void 0 : _d.projectId,
                timestamp: report.updateAt,
                timeAgo: (0, timeAgo_1.getTimeAgo)(report.updateAt)
            });
        });
        const requests = yield prisma.request.findMany({
            where: Object.assign(Object.assign({}, whereClause), dateWhereClause),
            orderBy: { createAt: 'desc' },
            take: 5,
            include: {
                project: {
                    select: { projectName: true }
                }
            }
        });
        requests.forEach(request => {
            var _a;
            activities.push({
                activityId: request.requestId,
                activityType: 'request',
                title: 'Request Submitted',
                description: `${request.activityTitle || 'Fund Request'} - ${request.status || 'Pending'}`,
                actor: request.staff || 'Unknown',
                projectName: (_a = request.project) === null || _a === void 0 ? void 0 : _a.projectName,
                projectId: request.projectId,
                timestamp: request.createAt,
                timeAgo: (0, timeAgo_1.getTimeAgo)(request.createAt)
            });
        });
        const teamMembers = yield prisma.teamMember.findMany({
            where: Object.assign(Object.assign({}, whereClause), dateWhereClause),
            orderBy: { createAt: 'desc' },
            take: 5,
            include: {
                project: {
                    select: { projectName: true }
                }
            }
        });
        teamMembers.forEach(member => {
            var _a;
            activities.push({
                activityId: member.teamMemberId,
                activityType: 'team_member',
                title: 'Team Member Added',
                description: `${member.fullName || 'New member'} joined as ${member.roleId || 'team member'}`,
                actor: 'System',
                projectName: (_a = member.project) === null || _a === void 0 ? void 0 : _a.projectName,
                projectId: member.projectId,
                timestamp: member.createAt,
                timeAgo: (0, timeAgo_1.getTimeAgo)(member.createAt)
            });
        });
        const indicatorReports = yield prisma.indicatorReport.findMany({
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
                timeAgo: (0, timeAgo_1.getTimeAgo)(report.createAt)
            });
        });
        const sortedActivities = activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
        return sortedActivities;
    });
}
function getPendingActivityFundRequests() {
    return __awaiter(this, arguments, void 0, function* (limit = 5) {
        const requests = yield prisma.request.findMany({
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
        return requests.map(request => {
            var _a;
            return ({
                requestId: request.requestId,
                title: request.activityTitle || 'Fund Request',
                projectName: ((_a = request.project) === null || _a === void 0 ? void 0 : _a.projectName) || 'Unknown Project',
                status: request.status || 'Pending',
                createdAt: request.createAt,
                timeAgo: (0, timeAgo_1.getTimeAgo)(request.createAt)
            });
        });
    });
}
function getPendingReportApprovals() {
    return __awaiter(this, arguments, void 0, function* (limit = 5) {
        const reports = yield prisma.indicatorReport.findMany({
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
            timeAgo: (0, timeAgo_1.getTimeAgo)(report.createAt)
        }));
    });
}
