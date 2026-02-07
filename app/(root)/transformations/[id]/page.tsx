import { auth } from "@clerk/nextjs";
import Link from "next/link";

import BeforeAfterSlider from "@/components/shared/BeforeAfterSlider";
import Header from "@/components/shared/Header";
import WallpaperDownload from "@/components/shared/WallpaperDownload";
import { Button } from "@/components/ui/button";
import { getImageById } from "@/lib/actions/image.actions";
import { getImageSize } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";
import { getCldImageUrl } from "next-cloudinary";

const ImageDetails = async ({ params: { id } }: SearchParamProps) => {
  const { userId } = auth();

  const image = await getImageById(id);

  const transformedUrl = getCldImageUrl({
    width: image.width,
    height: image.height,
    src: image.publicId,
    ...image.config,
  });

  return (
    <>
      <Header title={image.title} />

      <section className="mt-5 flex flex-wrap gap-4">
        <div className="p-14-medium md:p-16-medium flex gap-2">
          <p className="text-dark-600">Transformation:</p>
          <p className=" capitalize text-purple-400">
            {image.transformationType}
          </p>
        </div>

        {image.prompt && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2 ">
              <p className="text-dark-600">Prompt:</p>
              <p className=" capitalize text-purple-400">{image.prompt}</p>
            </div>
          </>
        )}

        {image.color && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-dark-600">Color:</p>
              <p className=" capitalize text-purple-400">{image.color}</p>
            </div>
          </>
        )}

        {image.aspectRatio && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-dark-600">Aspect Ratio:</p>
              <p className=" capitalize text-purple-400">{image.aspectRatio}</p>
            </div>
          </>
        )}
      </section>

      <section className="mt-10 border-t border-dark-400/15">
        <div className="py-8">
          <div className="flex-between mb-4">
            <h3 className="h3-bold text-dark-600">Comparison</h3>
            <WallpaperDownload
              image={{
                publicId: image.publicId,
                width: image.width,
                height: image.height,
              }}
              title={image.title}
              transformationConfig={image.config}
            />
          </div>

          <BeforeAfterSlider
            originalSrc={image.secureURL}
            transformedSrc={transformedUrl}
            originalAlt={`${image.title} - Original`}
            transformedAlt={`${image.title} - Transformed`}
            width={getImageSize(image.transformationType, image, "width")}
            height={getImageSize(image.transformationType, image, "height")}
          />
        </div>

        {userId === image.author.clerkId && (
          <div className="mt-4 space-y-4">
            <Button asChild type="button" className="submit-button capitalize">
              <Link href={`/transformations/${image._id}/update`}>
                Update Image
              </Link>
            </Button>

            <DeleteConfirmation imageId={image._id} />
          </div>
        )}
      </section>
    </>
  );
};

export default ImageDetails;
