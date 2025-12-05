import ChapterCard from "../../components/ChapterCard"
import Image from "next/image"
import earthLng from "@/public/earth-lng.png"
import earthTilt from "@/public/earth-tilt.png"
import apple from "@/public/apple.png"
import appleTilted from "@/public/apple-tilted.png"
import earthSunOrbit from "@/public/earth-sun-orbit.png"
import sunsHeight from "@/public/sun-height.png"
import sunsRays from "@/public/sun-rays.png"


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
                    Latitude measures position going north or south from the equator.
                    The latitude of a location is it’s angle  with respect to the equatorial plane.
                    Lines of latitude are referred to as parallels because they are parallel to the equator, and never intersect one another.
                </p>
                <p>
                    Longitude is a measurement of position going east or west.
                    Lines of longitude are measured from the prime meridian, an imaginary line that goes through a point in Greenwich London England from the north to the south pole.
                    Lines of longitude are called meridians, and they all intersect at the north and south pole, because they intersect these lines are not parallel and are drawn as curved lines on flat maps.
                </p>
                <Image src={earthLng} alt={"Lines of longitude on Earth"} />
            </section>
            <section className="space-y-6">
                <h2 className="text-2xl">
                    2. The Earth
                </h2>
                <p>
                    The Earth spins once around it’s axis every 24 hours giving us 24 hours days.
                    The Earth’s axis is an imaginary line through its centre from the North to the South Pole that it rotates around.
                    The equator is a imaginary line circling the Earth, located at the centre of the Earth.
                    It divides the Earth into equal parts, the northern and southern hemisphere.
                    The Earth’s axis and equator are perpendicular to each other.

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
                <div className="flex justify-evenly">
                    <Image src={apple} alt={"Apple with axis of rotation and equator"} />
                </div>
                <p>
                    Imagine the stem of the apple is the axis of rotation and the top and bottom of the apple are the north and south poles respectively.
                    Tilting the apple so that it’s axis of rotation/stem is at an angle of 23.5 degrees changes the direction the north and southern halves of the apple points.
                    In the image above the top half of the apple tilts toward the first apple and the bottom half is tilted away.
                    The idea is the same with the Earth.
                </p>
                <p>
                    It’s important to know that the Earth’s tilt does not change for one of its halves to face the sun, what changes is the position of the Earth around the sun.
                    In the image below the Earth tilts the same way, but depending on which side of the sun it is on determines whether the top or bottom half is directed toward or away from the sun.
                    During the months of Dec 21 to March 20 (winter in the northern hemisphere) the Earth is on part of it’s arc around the sun where the northern hemisphere is facing away from the sun and the southern hemisphere (summer in the southern hemisphere) is facing toward it.
                    During the months of June 20 to September 21 the Earth is on part of it’s arc where the northern hemisphere is facing the sun and the southern hemisphere is not.
                </p>
                <div className="flex justify-center">
                    <Image src={earthSunOrbit} alt={"Earth on it's orbit at the summer and winter solstice"} />
                </div>
            </section>
            <section className="space-y-6">
                <h2 className="text-2xl">
                    3. The Sun
                </h2>
                <p>
                    During summers in the northern hemisphere the Earth is on a part of it’s orbit around the sun where the north pole is directed towards the sun.
                    When the north pole is toward the sun, the sun appears higher in the sky in the northern hemisphere because it’s directed more at the sun.
                    The northern hemisphere is exposed to light with a angle of incidence closer to 90 degrees while in the southern hemisphere the light doesn’t hit directly and is more spread, the angle of incidence is more oblique and the sun appears lower in the sky.
                    During spring and autumn the earth is on part of it’s arc where its parallel to the sun and the Earth’s tilt is in a different direction to the suns rays.
                    Both hemispheres receive light at the same angle of incidence.
                </p>
                <Image src={sunsHeight} alt="The suns height in the sky" />
                <p>
                    The suns height\position in the sky is constantly changing.
                    The higher in the sky the sun is the more direct it’s light, more direct light is more intense because it’s energy is focused on a smaller area rather than spread out.
                    On the other hand if the sun is lower in the sky, it’s light is spread over a wider area and less intense.
                    During summer the sun is higher in the sky, as a result the sunlight is more intense and the temperature is hotter.
                    A higher sun also means a longer path over the sky, resulting in a longer day and again more heat.
                </p>
            </section>
            <section className="space-y-6">
                <h2 className="text-2xl">
                    4. Conclusion
                </h2>
                <p>
                    The sun appears lower in the sky around winter so solar panels should be more vertical during winter to capture the most light from the low winter sun, and the panel should be more flat during summer to capture more of the higher summer sun.
                    90 degree angles give more light and heat per unit area.
                </p>
                <Image src={sunsRays} alt="The rays of the sun on the Earht" />
                <p>
                    If you are located at the equator the sun is directly overhead at the equinoxes because the plane of sun light is perfectly perpendicular to the equator at this time.
                    The Earth is curved so the rays can’t be perfectly perpendicular to any other place like it is at the equator at that moment.
                    If you move away from the equator your latitude, angle relative to the equator changes.
                    Tilting the panel towards the equator at an angle equal to the latitude cancels out the angle difference between the Earths surface at your location with respect to the equator.
                    The plane tangent to Earth’s surface/panel becomes parallel with the axis of rotation when it’s tilted towards the equator at the angle of latitude.
                </p>
                <p>
                    Where the suns light shines directly (at 90 degrees) on the Earth shifts between the tropic of cancer in the north and the tropic of Capricorn in the south.
                    Since it goes between these two extremes the angle that does the best job at capturing the majority of this direct light is parallel to the equator because it’s the only line that the plane of sun light intersects more than once during its orbit around the sun.                </p>
            </section>
        </div>
    )
}

