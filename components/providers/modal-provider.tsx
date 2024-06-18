"use client";

import { useState, useEffect } from "react";
import { CardModal } from "../modals/card-modal";

export const ModalProvider = () => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <>
      <CardModal />
    </>
  );
};
