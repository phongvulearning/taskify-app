import { AuditLog, ACTION } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case ACTION.CREATE:
      return `created ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.UPDATE:
      return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.DELETE:
      return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.COPY:
      return `copied ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `performed an action on ${entityType.toLowerCase()} "${entityTitle}"`;
  }
};
