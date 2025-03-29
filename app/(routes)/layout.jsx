// ------------ Components ----------------
import { SideBar } from '../../components/browsing';

const Layout = ({ children }) => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-4 mt-20 px-6 sm:px-12 lg:px-32'>
            {/* Sidebar component that will appear on the left side */}
            <SideBar />

            {/* Main content area that spans 3 columns */}
            <div className='col-span-3'>
                {children} {/* Render any child components or content passed to the Layout */}
            </div>
        </div>
    );
}

export default Layout;