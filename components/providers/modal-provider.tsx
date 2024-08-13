"use client";

import { useState, useEffect } from "react";
import { CardModal } from "../modals/card-modal";
import { ProModal } from "../modals/pro-modals";

export const ModalProvider = () => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <>
      <CardModal />
      <ProModal />
    </>
  );
};
