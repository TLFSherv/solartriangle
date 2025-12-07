import ChapterCard from "../../components/ChapterCard"
import Image from "next/image"
import solarPanel from "@/public/solar-panel.png"
import tropics from "@/public/tropics.png"
import principalComponents from "@/public/principal-components.png"
import longestStretch from "@/public/longest-stretch.png"
import covariance from "@/public/covariance.png"
import eigenvector from "@/public/eigenvector.png"

export default function Azimuth() {
    const chapters = [
        { title: '1. Azimuth', id: "#section1", level: 0 },
        { title: '2. Finding Azimuth', id: "#section2", level: 0 },
        { title: "2.1 Principal Component Analysis", id: "#section3", level: 1 },
        { title: "2.2 PCA and Orientation", id: "#section4", level: 1 },
        { title: "2.3 PCA Steps", id: "#section5", level: 1 },
        { title: "2.31 The covariance matrix", id: "#section6", level: 2 },
        { title: "2.32 Eigenvector the final step", id: "#section7", level: 2 }
    ];

    return (
        <div className="mt-12 space-y-8 mx-6 font-[Space_Grotesk] font-light">
            <h1 className="text-4xl text-center tracking-wide underline">
                Calculating Azimuth
            </h1>
            <ChapterCard topicChapters={chapters} />
            <section id="section1" className="space-y-6">
                <h2 className="text-2xl">1. Azimuth</h2>
                <p>
                    The azimuth angle is the direction the panel points, it’s the angle between the face of the panel and the equator.
                    Azimuth is measured in a clockwise direction from north.
                    In most situations the best rule to apply is to point the panel towards the equator, so in the northern hemisphere that would mean pointing the panel to true south and in the southern hemisphere point the panel to true north.
                    For roof mounted solar panels it’s better to place the panels on a side of the roof that faces south.
                </p>
                <Image src={solarPanel} alt="Solar panel azimuth" />
                <p>
                    The reason it’s beneficial for the panel to face the equator is because the sun is directly overhead the tropics throughout the year, and at the equator twice during the equinoxes, spring and fall.
                    Since the sun is overhead around the equator, in the northern hemisphere the sun when it travels from East to West is in the southern part of the sky most of the time.
                    In the southern hemisphere the sun is in the northern part of the sky most of the time when it moves from East to West.
                </p>
                <div className="flex justify-center">
                    <Image src={tropics} alt="Map of the tropics" />
                </div>
            </section>
            <section id="section2" className="space-y-6">
                <h2 className="text-2xl">2. Finding Azimuth</h2>
                <p>
                    In order to find the azimuth of a roof mounted solar panel you need to know the roofs orientation.
                    To find the orientation of a roof we simplify it by representing it as a two-dimensional polygon.
                    To find the orientation of this polygon we use something called Principal Component Analysis (PCA).
                </p>
                <section id="section3" className="space-y-6">
                    <h3 className="text-xl">2.1 Principal Component Analysis (PCA)</h3>
                    <p>
                        PCA is a technique used to reduce the number of types of data we have in a dataset.
                        For example suppose we have a people dataset with 3 types of data: hair colour, age and salary.
                        What PCA does is create 3 new types of data (principal components) from our old data, but these new types of data no longer have the same meaning they had before.
                        The 3 principal components aren’t directly related to hair colour, age or salary anymore.
                        You can imagine the 3 original data types as ingredients in a recipe that once cooked become something new.
                        The cool thing about the result, the principal components, is that they capture all the information and detail originally contained in our data, but spread out unevenly amongst the principal components.
                    </p>
                    <div className="flex justify-center">
                        <Image src={principalComponents} alt="Cupcakes as principal components" />
                    </div>
                    <p>
                        It’s like we cooked three cupcakes from three ingredients: sugar, flour, and water and one cupcake got most of the ingredients, the second got a little less and the third got the least.
                        Similarly more information about the data is contained in the first principal component, less information is contained in the second and the least amount is contained in the third.
                        Therefore if we wanted to simplify our dataset and only have two features rather than our original three types of data, we could sacrifice a little accuracy and throw away our third principal component and just use the first two.
                        This is how PCA works - it mixes and bakes our original variables into a set of new variables called principal components - and then discards the ones that are less tasty.
                    </p>
                </section>
                <section id="section4" className="space-y-6">
                    <h3 className="text-xl">2.2 PCA and Orientation</h3>
                    <p>
                        PCA can be used to help us find the orientation of our polygon.
                        If we take the vertices of the polygon as our data points (x,y), PCA can tell us the direction that the points vary the most with the first principal component.
                        For a shape the direction of largest variation is the direction the shape stretches the most, the longest stretch.
                        The longest stretch is the direction your eyes move to look over the entire shape, or it’s the vector that goes between the furthest points.
                        For example for the rectangle it’s from left to right, for the pizza its down, from its base to the tip, and for the arrow its the direction the arrow points, 45 degrees.
                        The furthest stretch, i.e. the direction of greatest variation is the same as the orientation of these shapes.
                    </p>
                    <div className="flex justify-center">
                        <Image src={longestStretch} alt="Orientation of different shapes" />
                    </div>
                </section>
                <section id="section5" className="space-y-6">
                    <h3 className="text-xl">2.3 PCA Steps</h3>
                    <div className="space-y-2">
                        <p>
                            PCA finds this direction in the following way:
                        </p>
                        <ol className="list-decimal list-inside pl-4 space-y-2">
                            <li>
                                Firstly it represents the vertices of the polygon as data points.
                            </li>
                            <li>
                                Next it finds the average x and y coordinate of all the data points by summing all the x coordinates of the vertices and dividing by the number of vertices and it does the same for the y coordinate.
                                With the average, which is the centre of the polygon, it subtracts from all the vertices to get a new set of vertices.
                                This has the effect of changing the origin of the vertices to the centre of the polygon.
                            </li>
                            <li>
                                Next it finds the covariance matrix of these points.
                            </li>
                            <li>
                                Finally it calculates the eigenvector of the covariance matrix.
                            </li>
                        </ol>
                    </div>
                    <section id="section6" className="space-y-6">
                        <h3 className="text-lg">2.31 The covariance matrix</h3>
                        <p>
                            Variance is how much a value of the same type varies, basically a measure of differences.
                            Covariance measures how two different types of values change together.
                            For example x and y, or height and weight.
                            It asks the question if height increases how does weight change, does it increase, decrease or remain the same.
                        </p>
                        <p>
                            A covariance matrix is a way to visually represent the covariance of all the different types of data in a compact way.
                            The covariance of all the different data types/variables is represented both in the rows and columns of the matrix, allowing for a complete view of the relationships between all variables.
                            The covariance of the same variable is equal to that variables variance - this is why we have variance on the diagonal.
                        </p>
                        <div className="flex justify-center">
                            <Image src={covariance} alt="Covariance matrix" />
                        </div>
                    </section>
                    <section id="section7" className="space-y-6">
                        <h3 className="text-lg">2.32 Eigenvectors the final step</h3>
                        <div className="flex justify-center">
                            <Image src={eigenvector} alt="Eigenvector" />
                        </div>
                        <p>
                            Eigenvectors are non-zero vectors that when multiplied by a matrix (A) get scaled by a factor lambda called an eigenvalue.
                            Eigenvectors remain in the same direction after being multiplied/transformed by a matrix, the only thing that changes is their length.
                            Unlike other vectors whose direction is also altered all of the transformation is channeled toward affecting the scale.
                            Because length gets all the focus its maximised.
                            Therefore the eigenvector with the largest eigenvalue of the covariance matrix is the vector that is scaled the most, and this is the same direction along which the shape, our polygon varies the most.
                            Hence the direction of the eigenvector with the largest eigenvalue is the orientation of our roof and our solar panel.
                        </p>
                        <p>
                            “The eigenvector with the largest eigenvalue is the direction of greatest variance because it’s the direction in which the covariance matrix has the largest effect (stretches/scales the most).
                            When you multiply a vector in that direction by the covariance matrix, you get the biggest displacement (scaling), so that’s where the data is most spread out.”
                        </p>
                        <p>
                            This is how by using PCA we are able to calculate the orientation/azimuth of solar panels.
                        </p>
                    </section>
                </section>
            </section>
        </div>
    )

}