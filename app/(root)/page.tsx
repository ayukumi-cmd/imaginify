import { Collection } from "@/components/shared/Collection"
import SurpriseMe from "@/components/shared/SurpriseMe"
import { navLinks } from "@/constants"
import { getAllImages } from "@/lib/actions/image.actions"
import { SignedIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || '';

  const images = await getAllImages({ page, searchQuery})

  return (
    <>
      <section className="home">
        <h1 className="home-heading">
          Unleash Your Creative Vision with Imaginify
        </h1>
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1, 5).map((link, index) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2 feature-pop"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <li className="feature-icon">
                <Image src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card anim-delay-100">
          <div className="stat-card-icon">
            <Image src="/assets/icons/image.svg" alt="images" width={20} height={20} />
          </div>
          <div>
            <p className="p-20-semibold text-dark-600">{images?.savedImages || 0}</p>
            <p className="p-10-medium text-dark-400">Images Transformed</p>
          </div>
        </div>

        <div className="stat-card anim-delay-200">
          <div className="stat-card-icon">
            <Image src="/assets/icons/stars.svg" alt="features" width={20} height={20} />
          </div>
          <div>
            <p className="p-20-semibold text-dark-600">5</p>
            <p className="p-10-medium text-dark-400">AI Features</p>
          </div>
        </div>

        <div className="stat-card anim-delay-300">
          <div className="stat-card-icon">
            <Image src="/assets/icons/scan.svg" alt="ai" width={20} height={20} />
          </div>
          <div>
            <p className="p-20-semibold text-purple-500 font-bold">AI-Powered</p>
            <p className="p-10-medium text-dark-400">Cloudinary Engine</p>
          </div>
        </div>
      </section>

      {/* Surprise Me */}
      <SignedIn>
        <section className="flex-center mt-8 sm:mt-6 hidden sm:flex">
          <SurpriseMe />
        </section>
      </SignedIn>

      <section className="sm:mt-12">
        <Collection
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  )
}

export default Home