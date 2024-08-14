"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import Image from "next/image";
import Link from "next/link";

import { Check } from "lucide-react";
import { FormErrors } from "./form-errors";
import { unsplash } from "@/lib/unsplash";
import { ListImageUnsplash } from "@/constants/image";
import { Skeleton } from "../ui/skeleton";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>(ListImageUnsplash);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const result = await unsplash.photos.getRandom({
        count: 9,
        collectionIds: ["317099"],
      });

      if (result && result.response) {
        const newImages = result.response as any[];

        setImages(newImages);
      } else {
        console.log("no result");
        setImages([]);
      }
    } catch (error) {
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 mb-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="aspect-video bg-muted rounded-sm animate-pulse"
          >
            <Skeleton className="h-full w-full object-cover rounded-sm" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => {
          return (
            <div
              key={image.id}
              className={cn(
                "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted rounded-sm",
                {
                  "opacity-50 hover:opacity-50 cursor-auto": pending,
                }
              )}
              onClick={() => {
                if (pending) return;
                setSelectedImageId(image.id);
              }}
            >
              <input
                type="radio"
                id={id}
                name={id}
                hidden
                onChange={() => {}}
                disabled={pending}
                checked={selectedImageId === image.id}
                value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
              />
              <Image
                fill
                src={image.urls.small}
                alt="Unsplash image"
                className="object-cover rounded-sm"
                sizes="100px"
              />
              <Image
                priority
                fill
                src={image.urls.thumb}
                alt="Unsplash image"
                className="object-cover rounded-sm"
                sizes="100px"
              />
              {selectedImageId === image.id && (
                <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center rounded-sm">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <Link
                href={image.links.html}
                target="_blank"
                className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-0.5 bg-black/50"
              >
                {image.user.name}
              </Link>
            </div>
          );
        })}
      </div>
      <FormErrors id={id} errors={errors} />
    </div>
  );
};
