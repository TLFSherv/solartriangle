import ChapterCard from "../../components/ChapterCard"
import Image from "next/image"
import earthLng from "../../../../public/EarthLng.png"
import earthTilt from "../../../../public/earthTilt.png"

export default function PanelTilt() {
    const chapters = ['Latitude and Longitude',
        'The Earth',
        'The Sun',
        'Conclusion',]
    return (
        <div className="mt-12 space-y-8 mx-6 font-[Space_Grotesk] font-light">
            <h1 className="text-4xl text-center tracking-wide underline">
                Panel Tilt and Latitude
            </h1>
            <ChapterCard topicChapters={chapters} />
            <article className="font-normal text-lg">
                <h4>What is panel tilt?</h4>
                <p>
                    It’s the angle between the panel and the surface it’s mounted on.
                </p>
            </article>
            <section className="space-y-6">
                <h2 className="text-2xl">
                    1. Latitude and Longitude
                </h2>
                <p>
                    Latitude is a measurement of a location going north or south.
                    Latitude is measured from the equator where the latitude is 0 degrees. Latitude is the angle between a location and the equatorial plane.
                    Lines of latitude are referred to as parallels because they are parallel to the equator, and never intersect one another.
                </p>
                <p>
                    Longitude is a measurement of position going east or west.
                    Lines of longitude are measured from the prime meridian which is an imaginary line that goes through a point in Greenwich London England from the north to the south pole.
                    Lines of longitude are called meridians, and they all intersect at the north and south pole, because they intersect these lines are not parallel and are drawn as curved lines on flat maps.
                </p>
                <Image src={earthLng} alt={"Lines of longitude on Earth"} />
            </section>
            <section className="space-y-6">
                <h2 className="text-2xl">
                    2. The Earth
                </h2>
                <p>
                    The Earth spins once around it’s axis every 24hours which is why we have days.
                    The Earth’s axis is a imaginary line through its centre from the North to the South Pole that it rotates around.
                </p>
                <p>
                    The equator is a imaginary line circling the Earth, located at the centre of the Earth.
                    It divides the Earth into equal parts, the northern and southern hemisphere.
                    The Earth’s axis and equator are perpendicular.
                </p>
                <p>
                    The Earth’s axis of rotation is tilted relative to it’s path around the sun.
                    The Earth tilts on its axis at an angle of 23.5 degrees relative to the plane of it’s orbit around the sun.
                </p>
                <div className="flex justify-center">
                    <Image src={earthTilt} alt={"Earth's tilt relative to path around sun"} />
                </div>
                <p>
                    To understand this intuitively think of the Earth as an apple.
                </p>

            </section>
        </div>
    )
}

