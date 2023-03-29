import s from './index.module.css'
import cn from 'classnames'
import { useContext, useState } from 'react'

import { ReactComponent as FavIcon } from './img/fav.svg'
import { ReactComponent as ProfileIcon } from './img/profile.svg'
import { ReactComponent as ChartsIcon } from './img/charts.svg'
import { ReactComponent as CartIcon } from './img/cart.svg'
import { ReactComponent as LogIcon } from './img/log.svg'

import { Link, useLocation } from 'react-router-dom'
import { CardContext } from '../../context/cardContext'
import { UserContext } from '../../context/userContext'
import { useTranslation } from 'react-i18next'
import { Modal } from '../Modal/modal'
import { CreateProduct } from '../CreateProduct/CreateProduct'

function Header(props) {
  const { favorites, basket } = useContext(CardContext)
  const location = useLocation();
  const { i18n } = useTranslation();
  const [lang, setLang] = useState('ru');
  const [isActiveModal, setIsActiveModal] = useState(false);


  const changeLanguage = () => {
    const lang = localStorage.getItem('lang') ?? 'ru';
    const newLang = lang === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(newLang);
    setLang(newLang)
    localStorage.setItem('lang', newLang);
  }


  const { isAuthentificated, setActiveModal } = useContext(UserContext)

  return (
    <header className={cn(s.header, 'cover')}>
      <div className="container">
        <div className={s.wrapper}>
          {props.children}
          <div className={s.iconsMenu}>
            {isAuthentificated ? (
              <Link to={'/profile'} className={s.favoritesLink}>
                <ProfileIcon />
              </Link>
            ) : (
              <Link
                to={'/login'}
                className={s.favoritesLink}
                onClick={() => setActiveModal(true)}
                state={{
                  backgroundLocation: location,
                  initialPath: location.pathname,
                }}
              >
                {<LogIcon />}
              </Link>
            )}
            <Link to={'/visual'} className={s.favoritesLink}>
              <ChartsIcon />
            </Link>
            <Link className={s.favoritesLink} to={'/favorites'}>
              <FavIcon />
              {favorites.length !== 0 && (
                <span className={s.iconBubble}>{favorites.length}</span>
              )}
            </Link>
            <Link to={'/cart'} className={s.favoritesLink}>
              <CartIcon />
              {favorites.length !== 0 && (
                <span className={s.iconBubble}>{favorites.length}</span>
              )}
            </Link>
            <span onClick={() => setIsActiveModal(true)}>
              create

            </span>
            <span className={s.lang} onClick={() => changeLanguage()}>{lang}</span>
            {isActiveModal && <Modal activeModal={isActiveModal} setActiveModal={setIsActiveModal}>
              <CreateProduct setIsActiveModal={setIsActiveModal} />
            </Modal>}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header