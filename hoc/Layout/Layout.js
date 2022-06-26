import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import classes from './Layout.module.css'

function Layout(props) {
    return (
        <div className={classes.Layout}>
            <Header />
            {props.children}
            <Footer />
        </div>
    )
}
export default Layout;