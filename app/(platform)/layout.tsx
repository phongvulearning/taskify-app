import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

const PlatformLayout = ({ children }: { children: ReactNode }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default PlatformLayout;
