import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import { classNames } from "uploadthing/client";
import Link from "next/link";

async function page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) return redirect("/onboarding");

  //get activity
  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="mb-10 head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity?.author.image}
                    alt="Profile Image"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />

                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                        {activity?.author.name}
                    </span>
                    {" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-1">No Activity Yet</p>
        )}
      </section>
    </section>
  );
}

export default page;
