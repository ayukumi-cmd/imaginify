import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Collection } from "@/components/shared/Collection";
import Header from "@/components/shared/Header";
import Timeline from "@/components/shared/Timeline";
import { getUserImages } from "@/lib/actions/image.actions";
import { getUserById } from "@/lib/actions/user.actions";

const Profile = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const view = (searchParams?.view as string) || "grid";
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const images = await getUserImages({ page, userId: user._id });

  return (
    <>
      <Header title="Profile" />

      <section className="profile">
        <div className="profile-balance">
          <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{user.creditBalance}</h2>
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/photo.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{images?.data.length}</h2>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-14">
        {/* View Toggle */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={`/profile?view=grid&page=${page}`}
            className={`view-toggle-btn ${view === "grid" ? "active" : ""}`}
          >
            Grid View
          </Link>
          <Link
            href={`/profile?view=timeline&page=${page}`}
            className={`view-toggle-btn ${view === "timeline" ? "active" : ""}`}
          >
            Timeline
          </Link>
        </div>

        {view === "timeline" ? (
          <Timeline
            images={images?.data}
            totalPages={images?.totalPages ?? 1}
            page={page}
          />
        ) : (
          <Collection
            images={images?.data}
            totalPages={images?.totalPages}
            page={page}
          />
        )}
      </section>
    </>
  );
};

export default Profile;
