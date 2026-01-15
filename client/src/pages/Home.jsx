import CategoryList from '../components/CategoryList';
import HighlightSlider from '../components/HighlightSlider';
import NewArrivals from '../components/NewArrivals';
import PopularArticles from '../components/PopularArticles';

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            <CategoryList />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <div className="lg:col-span-2">
                    <HighlightSlider />
                </div>
                <div className="lg:col-span-1 h-64 md:h-80">
                    <PopularArticles />
                </div>
            </div>

            <NewArrivals />
        </div>
    );
};

export default Home;
