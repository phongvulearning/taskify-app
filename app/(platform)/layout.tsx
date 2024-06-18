import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

const PlatformLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider>
      <QueryProvider>
        <ModalProvider />
        <Toaster />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;
