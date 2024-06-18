import { auth, currentUser } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "./db";

interface Props {
  entityType: ENTITY_TYPE;
  entityId: string;
  action: ACTION;
  entityTitle: string;
}

export const createAuditLog = async (props: Props) => {
  const { orgId } = auth();
  const user = await currentUser();

  if (!orgId || !user) {
    throw new Error("Unauthorized");
  }

  const { entityId, entityTitle, entityType, action } = props;

  try {
    await db.auditLog.create({
      data: {
        orgId,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + " " + user?.lastName,
        entityId,
        entityTitle,
        entityType,
        action,
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
    throw new Error("Internal Server Error");
  }
};
