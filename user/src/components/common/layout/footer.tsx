import { PureComponent } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { IUser, IUIConfig } from 'src/interfaces';
import { withRouter, NextRouter } from 'next/router';

interface IProps {
  currentUser: IUser;
  ui: IUIConfig;
  router: NextRouter;
  customId?: string;
}
class Footer extends PureComponent<IProps> {
  render() {
    const {
      ui, currentUser, router, customId
    } = this.props;
    const menus = ui.menus && ui.menus.length > 0
      ? ui.menus.filter((m) => m.section === 'footer')
      : [];
    return (
      <div className="" id={customId || 'main-footer'}>
        <div className="">
          {/* <div className="flex">
            {!currentUser._id ? (
              <>
                <li key="login" className={router.pathname === '/' ? 'active' : ''}>
                  <Link href="/">
                    <a>Log in</a>
                  </Link>
                </li>
                <li key="signup" className={router.pathname === '/auth/register' ? 'active' : ''}>
                  <Link href="/auth/register">
                    <a>Sign up</a>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li key="home" className={router.pathname === '/home' ? 'active' : ''}>
                  <Link href="/home">
                    <a>Home</a>
                  </Link>
                </li>
                <li key="model" className={router.pathname === '/model' ? 'active' : ''}>
                  <Link href="/model">
                    <a>Model</a>
                  </Link>
                </li>
                <li key="contact" className={router.pathname === '/contact' ? 'active' : ''}>
                  <Link href="/contact">
                    <a>Contact</a>
                  </Link>
                </li>
              </>
            )}
            {menus
              && menus.length > 0
              && menus.map((item) => (
                <li key={item._id} className={router.pathname === item.path ? 'active' : ''}>
                  <a rel="noreferrer" href={item.path} target={item.isNewTab ? '_blank' : ''}>
                    {item.title}
                  </a>
                </li>
              ))}
          </div> */}
          {/* eslint-disable-next-line react/no-danger */}

          <div className="flex items-center">
            <p><strong>example.com © Copyright {new Date().getFullYear()}</strong></p>
          </div>
        </div>
      </div>
    );
  }
}
const mapState = (state: any) => ({
  currentUser: state.user.current,
  ui: { ...state.ui }
});
export default withRouter(connect(mapState)(Footer)) as any;
